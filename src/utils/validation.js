import { Result } from "index";

export const Validation = {
  isObjectEmpty(name, value) {
    const result = present(name, value, "object");

    if (result.ok) {
      if (Object.keys(value).length === 0) {
        return Result.error(`Empty '${name}' object found`, { name, value });
      } else {
        return Result.ok(value);
      }
    }

    return result; // propagate error
  },
  getByLocalStorage(name, key) {
    const result = present(name, key, "local-storage key");

    if (result.ok) {
      const value = localStorage.getItem(key);

      if (value) {
        return Result.ok(value);
      } else {
        return Result.error(`No '${key}' from local-storage found`, {
          name,
          key,
        });
      }
    }

    return result; // propagate error
  },
  setByLocalStorage(name, key, value) {
    const rkey = present(name, key, "local-storage key");
    const rvalue = present(name, key, "local-storage value");

    if (!rkey.ok) {
      return rkey; // propagate error
    } else if (!rvalue.ok) {
      return rvalue; // propagate error
    } else {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        return Result.error(
          `Failed to update '${key}' for '${name}' from local-storage`,
          { name, key, value, error },
        );
      }

      return Result.ok([rkey, rvalue]);
    }
  },
  getArray(name, value) {
    const result = present(name, value, "array");

    if (result.ok) {
      if (!Array.isArray(value)) {
        return Result.error(`Non-array '${name}' found`, { name, value });
      } else if (value.length === 0) {
        return Result.error(`Empty array of '${name}' found`, { name, value });
      } else {
        return Result.ok(value);
      }
    }

    return result; // propagate error
  },
  getNumber(name, value) {
    const result = present(name, value, "number");

    if (result.ok) {
      if (!(typeof value === "number")) {
        return Result.error(`Non-number '${name}' found`, { name, value });
      } else {
        return Result.ok(value);
      }
    }

    return result; // propagate error
  },
  getString(name, value) {
    const result = present(name, value, "string");

    if (result.ok) {
      if (!(typeof value === "string")) {
        return Result.error(`Non-string '${name}' found`, { name, value });
      } else {
        return Result.ok(value);
      }
    }

    return result; // propagate error
  },
};

function present(name, value, type) {
  if (!name) {
    return Result.error(`No name found to validate for type ${type}`, {
      name,
      value,
    });
  } else if (!value) {
    return Result.error(`No '${name}' ${type} found`, { name, value });
  }
}
