/**
 * Inspired by Rust's Result module (https://doc.rust-lang.org/std/result/).
 *
 * Helper functions for error handling and debugging.
 * Useful in JavaScript for debugging.
 */
export const Result = {
  /**
   * Returns successful data.
   */
  ok(data, log) {
    const result = {
      ok: true,
      data,
      error: null,
    };

    if (log) {
      console.log("SUCCESS\n", "DATA", data);
    }

    return result;
  },
  /**
   * Returns error(s) for unsuccessful computation.
   */
  error(message, cause) {
    const result = {
      ok: false,
      data: null,
      error: new Error(message, { cause }),
    };

    console.error("ERROR\n", "MESSAGE", message + "\n", "CAUSE", cause);

    return result;
  },
  /**
   * A utility function for handling computation for both successful and unsuccessful outcomes.
   * For neat shortcuts and consistency.
   */
  compute(results, onsuccess, onfail) {
    for (const result of results) {
      if (!result.ok) {
        if (onfail) {
          return onfail(result.error);
        } else {
          return result;
        }
      }
    }

    return onsuccess(results.map((result) => result.data));
  },
};

/**
 * Validates the given inputs.
 * Computations are wrapped in a result object.
 */
export const Validation = {
  getStringOrNumber(value) {
    return typeof value === "number"
      ? this.getNumber(value)
      : this.getString(value);
  },
  getObject(value) {
    if (!value) {
      return Result.error("No object found", value);
    } else if (!(typeof value === "object")) {
      return Result.error("Non-object found", value);
    } else if (Object.keys(value).length === 0) {
      return Result.error(`Empty object found`, value);
    } else {
      return Result.ok(value);
    }
  },
  getByLocalStorage(key) {
    if (!key) {
      return Result.error("No key found for local-storage", key);
    } else {
      const value = localStorage.getItem(key);

      if (value) {
        return Result.ok(value);
      } else {
        return Result.error(
          `No value for '${key}' from local-storage found`,
          key,
        );
      }
    }
  },
  setByLocalStorage(key, value) {
    if (!key) {
      return Result.error("No key found for local-storage", { key, value });
    } else if (!value) {
      return Result.error("No value found for local-storage", { key, value });
    } else {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        return Result.error(`Failed to update '${key}' from local-storage`, {
          key,
          value,
          error,
        });
      }

      return Result.ok(value);
    }
  },
  getArray(value) {
    if (!value) {
      return Result.error("No array found", value);
    } else if (!Array.isArray(value)) {
      return Result.error(`Non-array found`, value);
    } else if (value.length === 0) {
      return Result.error(`Empty array found`, value);
    } else {
      return Result.ok(value);
    }
  },
  getNumber(value) {
    if (value === undefined || value === null) {
      return Result.error("No number found", value);
    } else if (!(typeof +value === "number")) {
      return Result.error(`Non-number value found`, value);
    } else {
      return Result.ok(+value);
    }
  },
  getString(value) {
    if (!value) {
      return Result.error("No string found", value);
    } else if (!(typeof value === "string")) {
      return Result.error(`Non-string value found`, value);
    } else {
      return Result.ok(value);
    }
  },
};

/**
 * Utility functions for validating on creating, appending, removing, and retrieving elements.
 */
export const UIElements = {
  create(parent, type, callback) {
    const element = document.createElement(type);
    parent.append(element);

    if (callback) {
      try {
        callback(element);
      } catch (error) {
        Result.error("Failed to finish callback on element creation", {
          parent,
          type,
          error,
        });
      }
    }

    return element;
  },
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/className
  renew(id, callback) {
    const target = document.getElementById(id);

    if (target) {
      const parent = target.parentElement;
      const type = target.tagName;
      const classes = target.className;

      target.remove();

      const change = this.create(parent, type, (renewed) => {
        renewed.id = id;
        renewed.className = classes;

        if (callback) {
          callback(renewed);
        }
      });

      return Result.ok(change);
    } else {
      return Result.error("Invalid element renewal target", { id, target });
    }
  },
  append(parent, target) {
    if (!parent) {
      return Result.error("No parent element to append", { parent, target });
    } else if (!target) {
      return Result.error("No target element to append to parent element", {
        parent,
        target,
      });
    } else {
      parent.append(target);

      return Result.ok(target);
    }
  },
  getChildrens(target) {
    if (!target) {
      return Result.error("No element found", target);
    } else {
      return Result.ok(target.children);
    }
  },
  setId(element, id) {
    if (!element) {
      return Result.error("No element found", { element, id });
    } else {
      element.id = id;

      return Result.ok(element);
    }
  },
  getByIds(ids, callback) {
    const results = ids.map((value) => {
      const element = document.getElementById(value);

      if (element) {
        return Result.ok(element);
      } else {
        return Result.error("No element found by identifier", {
          element,
          value,
        });
      }
    });

    try {
      if (callback) {
        Result.compute(results, callback);
      }

      return results;
    } catch (error) {
      return Result.error("Failed to finish callback on element id retrieval", {
        results,
        error,
      });
    }
  },
};

/**
 * Utility functions for styling elements with validation.
 */
export const UIStyles = {
  getText(element) {
    return Validation.getStringOrNumber(element.textContent);
  },
  setText(element, value) {
    return Result.compute([Validation.getStringOrNumber(value)], ([text]) => {
      element.textContent = text;
    });
  },
  setBackgroundColor(element, value) {
    return Result.compute([Validation.getString(value)], ([color]) => {
      element.style.backgroundColor = color;
    });
  },
  setButtonToggleable(parent, button) {
    UIEvents.listen([button], "click", () => {
      Result.compute([UIElements.getChildrens(parent)], ([children]) => {
        if (children.length > 1) {
          for (const button of children) {
            UIClasses.remove(button, ["selected"]);
          }
        }
      });

      UIClasses.toggle(button, ["selected"]);
    });
  },
  // https://stackoverflow.com/questions/66419471/vue-3-vite-dynamic-image-src
  // https://vite.dev/guide/assets.html#the-public-directory
  getImagePath(name, base) {
    return new URL(name, base).href;
  },
};

/**
 * Utility functions for assigning element attributes quickly.
 */
export const UIAttributes = {
  get(element, keys) {
    return keys.map((key) => {
      return element.getAttribute(key);
    });
  },
  set(element, entries) {
    entries.forEach(([key, value]) => {
      Result.compute([Validation.getString(key)], ([key]) => {
        element.setAttribute(key, value.toString());
      });
    });
  },
  remove(element, keys) {
    keys.forEach((key) => {
      const result = Validation.getString(key);

      if (result.ok) {
        element.removeAttribute(element, key);
      }
    });
  },
  toggle(element, keys) {
    keys.forEach((key) => {
      Result.compute([Validation.getString(key)], ([key]) => {
        element.toggleAttribute(key);
      });
    });
  },
};

/**
 * Utility functions for adding element (CSS) classes quickly.
 */
export const UIClasses = {
  select(selectors) {
    return Array.from(document.querySelectorAll(selectors));
  },
  has(element, classes) {
    return classes.some((value) => {
      return element.classList.contains(value);
    });
  },
  add(element, classes) {
    classes.forEach((value) => {
      element.classList.add(value);
    });
  },
  set(element, classes) {
    element.classList = classes.join(" ");
  },
  remove(element, classes) {
    classes.forEach((value) => {
      element.classList.remove(value);
    });
  },
  toggle(element, classes) {
    classes.forEach((value) => {
      element.classList.toggle(value);
    });
  },
  replace(element, entries) {
    entries.forEach(([old, change]) => {
      element.classList.replace(old, change);
    });
  },
};

/**
 * Utility functions for hooking up event listeners quickly.
 */
export const UIEvents = {
  listen(elements, name, callback) {
    elements.forEach((element) =>
      element.addEventListener(name, (event) => {
        try {
          callback(event);
        } catch (error) {
          Result.error("Failed to finish callback on event", {
            name,
            event,
            error,
          });
        }
      }),
    );
  },
};
