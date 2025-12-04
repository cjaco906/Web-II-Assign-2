import { Result, Validation } from "./utils";

const ProductAPI = {
  async fetch() {
    const VALIDATION_NAME = "product-fetch";
    const LOCAL_STORAGE_KEY = "products";
    const FETCH_URL =
      "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    const cache = Validation.getByLocalStorage(
      VALIDATION_NAME,
      LOCAL_STORAGE_KEY,
    );

    if (cache.ok) {
      return cache;
    }

    return await fetch(FETCH_URL)
      .then((response) => {
        if (response.ok) {
          return Result.ok(response);
        } else {
          return Result.error("Failed to fetch products", response);
        }
      })
      .then(
        (response) => {
          const result = Validation.getArray(response.json());

          if (result.ok) {
            return Validation.setByLocalStorage(
              VALIDATION_NAME,
              LOCAL_STORAGE_KEY,
              result.data,
            );
          }

          return result;
        },
        (error) => Result.error("Non-JSON format found", error),
      );
  },
};
