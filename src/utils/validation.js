export const Validation = {
  getArray(name, value) {
    if (!name) {
      return Result.error("No name found to validate for array", {
        name,
        value,
      });
    } else if (!Array.isArray(value)) {
      return Result.error(`Non-array '${name}' found`, { name, value });
    } else if (value.length === 0) {
      return Result.error(`Empty array of '${name}' found`, { name, value });
    } else {
      return Result.ok(value);
    }
  },
  getNumber(name, value) {
    if (!name) {
      return Result.error("No name found to validate for number", {
        name,
        value,
      });
    } else if (!(typeof value === "number")) {
      return Result.error(`Non-number '${name}' found`, { name, value });
    } else {
      return Result.ok(value);
    }
  },
  getString(name, value) {
    if (!name) {
      return Result.error("No name found to validate for string", {
        name,
        value,
      });
    } else if (!(typeof value === "string")) {
      return Result.error(`Non-string '${name}' found`, { name, value });
    } else {
      return Result.ok(value);
    }
  },
};
