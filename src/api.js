import { Result, Validation } from "./utils";

export const ProductStorage = {
  async fetch() {
    const LOCAL_STORAGE_KEY = "products";
    const FETCH_URL =
      "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    const cache = Validation.getByLocalStorage(LOCAL_STORAGE_KEY);

    if (cache.ok) {
      try {
        return Result.ok(cache.data);
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
