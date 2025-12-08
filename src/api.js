import { Result, Validation } from "./utils";

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
                        JSON.stringify(products)
                      );
                    } catch (error) {
                      return Result.error(
                        "Failed to stringify the downloaded products",
                        { products, error }
                      );
                    }
                  }
                );
              });
            },
            (error) => Result.error("Non-JSON format found", error)
          );
      }
    );
  },
};

export const ProductBrowsing = {
  getScore(base, target) {
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
              }
            );
          } else if (typeof bvalue === "object") {
            const subscore = this.getScore(bvalue, tvalue);

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
      }
    );
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
                [this.getScore(base, target)],
                ([score]) => {
                  scores.push(score);

                  return Result.ok(score);
                }
              );
            }
          );

          if (!result.ok) {
            return result;
          }
        }

        const sorted = scores
          .sort((a, b) => b.score - a.score)
          .map(({ product }) => product);

        if (limit) {
          sorted.length = limit;
        }

        return Result.ok(sorted);
      });
    }
  },
};

export const ShoppingCart = {
  get() {
    const SHOPPING_CART_KEY = "shopping-cart";

    return Result.compute(
      [Validation.getByLocalStorage(SHOPPING_CART_KEY)],
      ([cart]) => {
        return Result.ok(cart);
      },
      () => {
        return Result.compute(
          [Validation.setByLocalStorage(SHOPPING_CART_KEY, [])],
          ([cart]) => {
            return Result.ok(cart);
          }
        );
      }
    );
  },
  getOrder(product) {
    return Result.compute(
      [this.get(), Validation.getObject(product)],
      ([cart, product]) => {
        const order = cart.find((order) => order.id === product.id);

        return Result.ok(order ?? null);
      }
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
        return Result.error("Invalid country index", { country, subtotal });
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
      }
    );
  },
  add(order) {
    return Result.compute(
      [this.get(), Validation.getObject(order)],
      ([cart, order]) => {
        return Result.compute(
          [this.getOrder(order.product)],
          ([old]) => {
            old.unit += order.unit;

            return Result.ok(order);
          },
          () => {
            cart.push(order);

            return Result.ok(order);
          }
        );
      }
    );
  },
};
