import { Result, UIElements, UIStyles, Validation } from "./utils";

/**
 * Fetches and stores product data.
 * This caches the product data upon first download/visit.
 */
export const ProductStorage = {
  fetch() {
    const LOCAL_STORAGE_KEY = "products";
    const FETCH_URL =
      "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    return Result.compute(
      [Validation.getByLocalStorage(LOCAL_STORAGE_KEY)],
      ([cache]) => {
        try {
          return Result.ok(JSON.parse(cache));
        } catch (error) {
          return Result.error("Failed to parse the products cache", {
            cache,
            error,
          });
        }
      },
      async () => {
        return await fetch(FETCH_URL)
          .then((response) => {
            if (response.ok) {
              return Result.ok(response.json());
            } else {
              return Result.error("Failed to fetch products", response);
            }
          })
          .then(
            (response) => {
              return Result.compute([response], async ([response]) => {
                return Result.compute(
                  [Validation.getArray(await response)],
                  ([products]) => {
                    try {
                      return Validation.setByLocalStorage(
                        LOCAL_STORAGE_KEY,
                        JSON.stringify(products),
                      );
                    } catch (error) {
                      return Result.error(
                        "Failed to stringify the downloaded products",
                        { products, error },
                      );
                    }
                  },
                );
              });
            },
            (error) => Result.error("Non-JSON format found", error),
          );
      },
    );
  },
};

/**
 * The sorting types for product browsing.
 */
export const ProductSortingTypes = {
  NAME_ASCENDING: "Name (Ascending)",
  NAME_DESCENDING: "Name (Descending)",
  PRICE_LOWEST: "Price (Lowest)",
  PRICE_HIGHEST: "Price (Highest)",
  CATEGORY_ASCENDING: "Category (Ascending)",
  CATEGORY_DESCENDING: "Category (Descending)",
};

/**
 * Implements the functionalities related to browsing products.
 */
export const ProductBrowsing = {
  /**
   * Returns the product object by the given product identifier.
   */
  getById(products, id) {
    return Result.compute([Validation.getNumber(id.slice(1))], (index) => {
      return Validation.getObject(products[index]);
    });
  },
  /**
   * Returns all unique product types (properties) that exist.
   *
   * https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-a-javascript-array
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
   */
  getTypes(products) {
    const types = {
      genders: new Set(),
      categories: new Set(),
      colors: new Set(),
      sizes: new Set(),
    };

    for (const product of products) {
      types.genders.add(product.gender);
      types.categories.add(product.category);

      product.color.map((color) => {
        types.colors.add(color);
      });
      product.sizes.map((size) => {
        types.sizes.add(size);
      });
    }

    return types;
  },
  /**
   * Evaluates a score based on the given base product matching to the given target product to compare.
   * Higher scores indicate higher relatability.
   */
  getScoreByBaseAssociation(base, target) {
    return Result.compute(
      [Validation.getObject(base), Validation.getObject(target)],
      ([base, target]) => {
        let score = 0;

        for (const [key, bvalue] of Object.entries(base)) {
          const tvalue = target[key];

          if (Array.isArray(bvalue)) {
            Result.compute(
              [Validation.getArray(bvalue), Validation.getArray(tvalue)],
              ([barray, tarray]) => {
                for (const bitem of barray.sort()) {
                  for (const titem of tarray.sort()) {
                    if (bitem === titem) {
                      ++score;
                    }
                  }
                }
              },
            );
          } else if (typeof bvalue === "object") {
            const subscore = this.getScoreByBaseAssociation(bvalue, tvalue);

            if (subscore.ok) {
              score += subscore.data.score;
            } else {
              return subscore;
            }
          }

          if (bvalue === tvalue) {
            ++score;
          }
        }

        return Result.ok({ score, product: target });
      },
    );
  },
  /**
   * Evaluates a score based on the given target product matching the given selection types (properties) to compare.
   * Higher scores indicate higher relatability.
   */
  getScoreBySelection(target, selection) {
    return Result.compute(
      [Validation.getObject(target), Validation.getObject(selection)],
      ([target, selection]) => {
        const evaluate = (target, values) => {
          if (Array.isArray(target)) {
            return target
              .map((value) => {
                return evaluate(value, values);
              })
              .reduce((accumulator, current) => {
                return accumulator + current;
              });
          } else if (typeof target === "object") {
            return Object.values(target)
              .map((subtarget) => {
                return evaluate(subtarget, values);
              })
              .reduce((accumulator, current) => {
                return accumulator + current;
              });
          } else {
            for (const value of values) {
              if (value === target) {
                return 1;
              }
            }

            return 0;
          }
        };

        const score = [
          evaluate(target.gender, selection.genders),
          evaluate(target.category, selection.categories),
          evaluate(target.color, selection.color),
          evaluate(target.sizes, selection.sizes),
        ].reduce((accumulator, current) => {
          return accumulator + current;
        });

        return Result.ok({ score, product: target });
      },
    );
  },
  /**
   * Sorts the scores from highest to lowest number.
   * The given limit constrains the amount of scored products; the limit parameter optional.
   */
  getSortedScores(scores, limit) {
    const sorted = scores
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);

    if (limit) {
      sorted.length = limit;
    }

    return Result.ok(sorted);
  },
  /**
   * Searches for products that matches the given selection criteria (i.e., product types such as categories, genders, sizes, colors, names, prices).
   * Uses a scoring algorithim (see above).
   * The given limit constrains the amount of scored products; the limit parameter is optional.
   */
  getBySearch(products, selection, limit) {
    const sort = selection.sort;
    const scores = [];

    for (const target of products) {
      const { data: score } = this.getScoreBySelection(target, selection);

      if (score) {
        scores.push(score);
      }
    }

    return Result.compute([this.getSortedScores(scores, limit)], ([scores]) => {
      return Result.ok(
        scores.sort((a, b) => {
          switch (sort) {
            case ProductSortingTypes.NAME_ASCENDING:
              return a.name > b.name;
            case ProductSortingTypes.NAME_DESCENDING:
              return a.name < b.name;
            case ProductSortingTypes.CATEGORY_ASCENDING:
              return a.category > b.category;
            case ProductSortingTypes.CATEGORY_DESCENDING:
              return a.category < b.category;
            case ProductSortingTypes.PRICE_LOWEST:
              return a.price - b.price;
            case ProductSortingTypes.PRICE_HIGHEST:
              return b.price - a.price;
          }
        }),
      );
    });
  },
  /**
   * Searches for product recommendations based on the given base product to compare to other products.
   * Uses a scoring algorithim (see above).
   * The given limit constrains the amount of scored products; the limit parameter is optional.
   */
  getRecommendations(base, limit) {
    if (!base) {
      return Result.error("No product found for recommendations", base);
    } else {
      return Result.compute([ProductStorage.fetch()], ([products]) => {
        const scores = [];

        for (const target of products) {
          if (base.id === target.id) continue;

          const result = Result.compute(
            [Validation.getObject(target)],
            ([target]) => {
              return Result.compute(
                [this.getScoreByBaseAssociation(base, target)],
                ([score]) => {
                  scores.push(score);

                  return Result.ok(score);
                },
              );
            },
          );

          if (!result.ok) {
            return result;
          }
        }

        return this.getSortedScores(scores, limit);
      });
    }
  },
};

/**
 * Responsible for holding and removing product order placements/removal.
 */
export const ShoppingCart = {
  /**
   * Updates the shoppng cart quantity counter.
   */
  update(cart) {
    if (cart) {
      UIElements.getByIds(["nav-cart-quantity"], ([quantity]) => {
        UIStyles.setText(quantity, cart.length);
      });
    } else {
      Result.compute([this.get()], ([cart]) => {
        this.update(cart);
      });
    }
  },
  /**
   * The local storage key for the shopping cart.
   */
  getKey() {
    return "shopping-cart";
  },
  /**
   * Returns the shopping cart from local storage and is wrapped in a result.
   */
  get() {
    const key = this.getKey();
    return Result.compute(
      [Validation.getByLocalStorage(key)],
      ([cart]) => {
        return Result.ok(JSON.parse(cart));
      },
      () => {
        return Result.compute(
          [Validation.setByLocalStorage(key, [])],
          ([cart]) => {
            return Result.ok(cart);
          },
        );
      },
    );
  },
  /**
   * Returns the product orders (shopping cart items) from the shopping cart.
   * If the specified order does not exist, it returns null.
   */
  getOrder(product) {
    return Result.compute(
      [this.get(), Validation.getObject(product)],
      ([cart, product]) => {
        const order = cart.find((order) => order.id === product.id);

        return Result.ok(order ?? null);
      },
    );
  },
  /**
   * An immutable list of countries for order/product checkout.
   */
  getCountryTypes() {
    return ["Canada", "United States", "International"];
  },
  /**
   * Returns the calculated tax costs based on the given country.
   */
  getTaxCost(country, subtotal) {
    return Result.compute([Validation.getNumber(country)], ([country]) => {
      if ("Canada" === this.getCountryTypes()[country]) {
        return Result.ok(subtotal * 0.05);
      } else {
        return Result.ok(0);
      }
    });
  },
  /**
   * An immutable list of shipping types for order/product checkout.
   */
  getShippingTypes() {
    return ["Standard", "Express", "Priority"];
  },
  /**
   * Returns the shipping costs based on the given shipping type and country destination.
   */
  getShippingCost(type, country) {
    return Result.compute(
      [Validation.getNumber(type), Validation.getNumber(country)],
      ([type, country]) => {
        const base = 10 * (type + 1);
        const extra = 5 * country;

        if (base < 30) {
          return Result.ok(base + extra);
        } else if (extra === 0) {
          return Result.ok(base + 5);
        } else {
          return Result.ok(50);
        }
      },
    );
  },
  /*
   * Places the given product order to the shopping cart and is saved to local storage.
   */
  order(order) {
    return Result.compute(
      [this.get(), Validation.getObject(order)],
      ([cart, { product, selection }]) => {
        const order = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: selection.quantity,
          sizes: selection.sizes,
          color: selection.color,
        };

        cart.push(order);

        return Result.compute(
          [Validation.setByLocalStorage(this.getKey(), JSON.stringify(cart))],
          () => {
            this.update();
          },
        );
      },
    );
  },
  /**
   * Removes the given product order from the shopping cart.
   * A reduction of product orders updates the local storage.
   */
  remove(order) {
    return Result.compute(
      [this.get(), Validation.getObject(order)],
      ([cart, target]) => {
        return Result.compute(
          [
            Validation.setByLocalStorage(
              this.getKey(),
              JSON.stringify(cart.filter((order) => order.id !== target.id)),
            ),
          ],
          ([cart]) => {
            this.update();

            return Result.ok(cart);
          },
        );
      },
    );
  },
  /**
   * clears all product orders from the shopping cart.
   * Updates the local storage.
   */
  clear() {
    return Result.compute(
      [Validation.setByLocalStorage(this.getKey(), [])],
      ([cart]) => {
        this.update();

        return Result.ok(cart);
      },
    );
  },
};
