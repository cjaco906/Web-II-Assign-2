import { Result } from "index";

export const UIElements = {
  getByIds(ids) {
    return ids.map((value) => {
      const element = document.getElementById(value);

      if (element) {
        return Result.ok(element);
      } else {
        return Result.error("HTML element not found by identifier", value);
      }
    });
  },
  getByClasses(classes) {
    return classes.map((value) => {
      const element = document.getElementsByClassName(value);

      if (element) {
        return Result.ok(element);
      } else {
        return Result.error("HTML element not found by class", value);
      }
    });
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
