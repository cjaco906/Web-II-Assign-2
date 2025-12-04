import { Result, Validation } from "./utils";

const PRODUCT_DATA_URL =
  "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

const ProductAPI = {
  async fetch() {
    return await fetch(PRODUCT_DATA_URL)
      .then((response) => {
        if (response.ok) {
          return Result.ok(response);
        } else {
          return Result.error("Failed to fetch product data", response);
        }
      })
      .then((response) => Result.ok(response.json()))
      .catch((error) => Result.error("Non-JSON format found", error));
  },
};

function validate(json) {
  if (Object.keys(json).length === 0) {
    return Result.error("Empty object found", json);
  }

  return {
    name() {
      return Validation.getString("name", json.name);
    },
    gender() {
      return Validation.getString("gender", json.gender);
    },
    category() {
      return Validation.getString("category", json.category);
    },
    description() {
      return Validation.getString("description", json.description);
    },
    price() {
      return Validation.getNumber("price", json.price);
    },
    shipping() {
      return Validation.getNumber("cost", json.cost);
    },
  };
}
