import { Result, Validation } from "./utils";

export const ProductStorage = {
  async fetch() {
    const LOCAL_STORAGE_KEY = "products";
    const FETCH_URL =
      "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    const cache = Validation.getByLocalStorage(LOCAL_STORAGE_KEY);

    if (cache.ok) {
      try {
        return Result.ok(JSON.parse(cache.data));
      } catch (error) {
        return Result.error("Failed to parse the products cache", {
          cache,
          error,
        });
      }
    }

    return await fetch(FETCH_URL)
      .then((response) => {
        if (response.ok) {
          return Result.ok(response.json());
        } else {
          return Result.error("Failed to fetch products", response);
        }
      })
      .then(
        async (response) => {
          if (response.ok) {
            const products = Validation.getArray(await response.data);

            if (products.ok) {
              try {
                return Validation.setByLocalStorage(
                  LOCAL_STORAGE_KEY,
                  JSON.stringify(products.data),
                );
              } catch (error) {
                return Result.error(
                  "Failed to stringify the downloaded products",
                  { products, error },
                );
              }
            }

            return products;
          } else {
            return response;
          }
        },
        (error) => Result.error("Non-JSON format found", error),
      );
  },
};

export const ProductBrowsing = {
  getScore(base, target) {
    const [rbase, rtarget] = [
      Validation.getObject(base),
      Validation.getObject(target),
    ];

    if (!rbase.ok) {
      return rbase;
    } else if (!rtarget.ok) {
      return rtarget;
    } else {
      const [{ data: base }, { data: target }] = [rbase, rtarget];
      let score = 0;

      for (const [key, bvalue] of Object.entries(base)) {
        const tvalue = target[key];
        const isObject = typeof bvalue === "object";

        if (isObject) {
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
  },
  async getRecommendations(base, limit) {
    if (!base) {
      return Result.error("No product found for recommendations", base);
    }

    const products = await ProductStorage.fetch();

    if (products.ok) {
      const scores = [];

      for (const target of products.data) {
        if (base.id === target.id) continue;

        const check = Validation.getObject(target);

        if (check.ok) {
          const score = this.getScore(base, target);

          if (score.ok) {
            scores.push(score.data);
          } else {
            return score;
          }
        } else {
          return check;
        }
      }

      const sorted = scores.sort((a, b) => b.score - a.score);

      if (limit) {
        sorted.length = limit;
      }

      return Result.ok(sorted);
    }

    return products;
  },
};
