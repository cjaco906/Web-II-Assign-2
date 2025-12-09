import { Result, UIElements, UIStyles, Validation } from "./utils";

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

export const ProductSortingTypes = {
  NAME_ASCENDING: "Name (Ascending)",
  NAME_DESCENDING: "Name (Descending)",
  PRICE_LOWEST: "Price (Lowest)",
  PRICE_HIGHEST: "Price (Highest)",
  CATEGORY_ASCENDING: "Category (Ascending)",
  CATEGORY_DESCENDING: "Category (Descending)",
};

export const ProductBrowsing = {
  getById(products, id) {
    return Result.compute([Validation.getNumber(id.slice(1))], (index) => {
      return Validation.getObject(products[index]);
    });
  },
  // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-a-javascript-array
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
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
  getSortedScores(scores, limit) {
    const sorted = scores
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);

    if (limit) {
      sorted.length = limit;
    }

    return Result.ok(sorted);
  },
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

export const ShoppingCart = {
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
  getKey() {
    return "shopping-cart";
  },
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
  getOrder(product) {
    return Result.compute(
      [this.get(), Validation.getObject(product)],
      ([cart, product]) => {
        const order = cart.find((order) => order.id === product.id);

        return Result.ok(order ?? null);
      },
    );
  },
  getCountryTypes() {
    return ["Canada", "United States", "International"];
  },
  getTaxCost(country, subtotal) {
    return Result.compute([Validation.getNumber(country)], ([country]) => {
      if ("Canada" === this.getCountryTypes()[country]) {
        return Result.ok(subtotal * 0.05);
      } else {
        return Result.ok(0);
      }
    });
  },
  getShippingTypes() {
    return ["Standard", "Express", "Priority"];
  },
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
          () => {
            this.update();
          },
        );
      },
    );
  },
};
