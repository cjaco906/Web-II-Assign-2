export const Result = {
  ok(data, log) {
    const result = {
      ok: true,
      data,
      error: null,
    };

    if (log) {
      console.log("SUCCESS\n", "DATA", data + "\n", result);
    }

    return result;
  },
  error(message, cause) {
    const result = {
      ok: false,
      data: null,
      error: new Error(message, cause),
    };

    console.error(
      "ERROR\n",
      "MESSAGE",
      message + "\n",
      "CAUSE",
      cause + "\n",
      result,
    );

    return result;
  },
  empty() {
    return {
      ok: false,
      data: null,
      error: null,
    };
  },
  short(result) {
    return {
      success(callback) {
        if (result.ok) {
          callback(result.data);
        }

        return result;
      },
      error(callback) {
        if (result.error) {
          callback(result.error);
        }

        return result;
      },
    };
  },
};

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
        return Result.ok(+value);
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

export const UIElements = {
  create(parent, type, callback) {
    const element = document.createElement(type);
    parent.append(element);

    if (callback) {
      callback(element);
    }

    return element;
  },
  getByIds(ids) {
    return Result.short(
      ids.map((value) => {
        const element = document.getElementById(value);

        if (element) {
          return Result.ok(element);
        } else {
          return Result.error("HTML element not found by identifier", value);
        }
      }),
    );
  },
  getByClasses(classes) {
    return Result.short(
      classes.map((value) => {
        const element = document.getElementsByClassName(value);

        if (element) {
          return Result.ok(element);
        } else {
          return Result.error("HTML element not found by class", value);
        }
      }),
    );
  },
};

export const UIAttributes = {
  get(element, keys) {
    return keys.map((key) => element.getAttribute(key));
  },
  set(element, entries) {
    entries.forEach(([key, value]) => element.setAttribute(key, value));
  },
  remove(element, keys) {
    keys.forEach((key) => element.removeAttribute(element, key));
  },
  replace(element, key, [old, change]) {
    if (element.hasAttribute(key, old)) {
      element.setAttribute(key, change);
    }
  },
  toggle(element, keys) {
    keys.forEach((key) => element.toggleAttribute(key));
  },
};

export const UIClasses = {
  add(element, classes) {
    classes.forEach((value) => element.classList.add(value));
  },
  remove(element, classes) {
    classes.forEach((value) => element.classList.remove(value));
  },
  toggle(element, classes) {
    classes.forEach((value) => element.classList.toggle(value));
  },
  replace(element, entries) {
    entries.forEach(([old, change]) => element.classList.replace(old, change));
  },
};
