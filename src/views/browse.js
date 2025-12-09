import { ProductBrowsing, ProductSortingTypes, ShoppingCart } from "../api";
import { showToast } from "../toast";
import {
  Result,
  UIAttributes,
  UIClasses,
  UIElements,
  UIEvents,
  UIStyles,
} from "../utils";
import { ProductOverview } from "./product";

const Identifiers = {
  DROPDOWN_GENDERS: "browse-genders",
  DROPDOWN_CATEGORIES: "browse-categories",
  DROPDOWN_SIZES: "browse-sizes",
  DROPDOWN_COLORS: "browse-colors",
  FILTERS: "browse-filters",
  SELECTION_SORT: "browse-sort-select",
  PRODUCT_OVERVIEWS: "browse-product-overviews",
};
const getDropdownIdentifier = (value) => {
  return `${Identifiers.FILTERS}-department-${value.toLowerCase()}`;
};

let BrowseSelector;

export const BrowseView = {
  create(products, id) {
    return UIElements.getByIds([id], ([view]) => {
      UIElements.create(view, "section", (section) => {
        UIClasses.set(section, ["columns", "mt-6"]);

        UIElements.create(section, "div", (left) => {
          UIClasses.set(left, ["column", "is-3"]);
          CreateSubview.departments(products, left);

          UIElements.create(section, "div", (right) => {
            UIClasses.set(right, ["column", "is-9"]);
            CreateSubview.top(products, right);
            CreateSubview.overviews(right);
          });
        });
      });
    });
  },
  renew(products) {
    const selection = {
      genders: new Set(),
      categories: new Set(),
      sizes: new Set(),
      colors: new Set(),
    };
    const submit = () => {
      UIElements.renew(Identifiers.PRODUCT_OVERVIEWS, (overviews) => {
        Result.compute(
          [ProductBrowsing.getBySearch(products, selection, 10)],
          ([products]) => {
            ProductOverview.create(overviews, "Products", products);
          },
        );
      });
    };
    const select = (set, value) => {
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }

      UIElements.getByIds([Identifiers.FILTERS], ([filters]) => {
        const id = `${Identifiers.FILTERS}-${value.toLowerCase()}`;
        const element = document.getElementById(id);

        if (element) {
          element.remove();
        } else {
          UIElements.create(filters, "button", (filter) => {
            UIStyles.setText(filter, value);
            UIClasses.set(filter, ["filter-delete"]);
            UIElements.setId(
              filter,
              `${Identifiers.FILTERS}-${value.toLowerCase()}`,
            );
            UIEvents.listen([filter], "click", () => {
              UIElements.getByIds(
                [getDropdownIdentifier(value)],
                ([button]) => {
                  UIClasses.remove(button, ["selected"]);
                  console.log(button);
                },
              );

              filter.remove();
            });
          });
        }
      });

      submit();
    };

    BrowseSelector = {
      gender(gender) {
        select(selection.genders, gender);
      },
      category(category) {
        select(selection.categories, category);
      },
      size(size) {
        select(selection.sizes, size);
      },
      color(color) {
        select(selection.colors, color);
      },
      sort(type) {
        selection.sort = type;

        submit();
      },
    };

    BrowseSelector.sort("name");
  },
};

const CreateSubview = {
  departments(products, section) {
    UIElements.create(section, "div", (panel) => {
      UIClasses.set(panel, ["box", "p-5", "mb-5", "browse-sidebar"]);
      UIElements.create(panel, "h2", (title) => {
        UIStyles.setText(title, "Departments");
        UIClasses.set(title, ["is-size-5", "has-text-weight-bold", "mb-4"]);
      });
      UIElements.create(panel, "div", (dropdowns) => {
        const types = ProductBrowsing.getTypes(products);
        const setId = (element, value) => {
          UIElements.setId(element, getDropdownIdentifier(value));
        };

        UIElements.create(dropdowns, "div", (genders) => {
          UIClasses.add(genders, ["browse-filter-group"]);

          UIElements.create(genders, "h3", (title) => {
            UIStyles.setText(title, "Gender");
            UIClasses.set(title, [
              "is-size-6",
              "has-text-weight-semibold",
              "mb-2",
            ]);
          });
          UIElements.create(genders, "div", (contents) => {
            UIClasses.add(contents, ["browse-filter-options"]);
            for (const value of types.genders) {
              UIElements.create(contents, "button", (gender) => {
                setId(gender, value);

                UIStyles.setText(gender, value);
                UIEvents.listen([gender], "click", () => {
                  BrowseSelector.gender(value);

                  UIClasses.toggle(gender, ["selected"]);
                });
              });
            }
          });
        });
        UIElements.create(dropdowns, "div", (categories) => {
          UIClasses.add(categories, ["browse-filter-group"]);

          UIElements.create(categories, "h3", (title) => {
            UIStyles.setText(title, "Category");
            UIClasses.set(title, [
              "is-size-6",
              "has-text-weight-semibold",
              "mb-2",
            ]);
          });
          UIElements.create(categories, "div", (contents) => {
            UIClasses.add(contents, ["browse-filter-options"]);

            for (const value of types.categories) {
              UIElements.create(contents, "button", (category) => {
                setId(category, value);

                UIStyles.setText(category, value);
                UIEvents.listen([category], "click", () => {
                  BrowseSelector.category(value);

                  UIClasses.toggle(category, ["selected"]);
                });
              });
            }
          });
        });
        UIElements.create(dropdowns, "div", (sizes) => {
          UIClasses.add(sizes, ["browse-filter-group"]);

          UIElements.create(sizes, "h3", (title) => {
            UIStyles.setText(title, "Size");
            UIClasses.set(title, [
              "is-size-6",
              "has-text-weight-semibold",
              "mb-2",
            ]);
          });

          UIElements.create(sizes, "div", (contents) => {
            UIClasses.add(contents, ["browse-filter-options"]);
            for (const value of types.sizes) {
              UIElements.create(contents, "button", (size) => {
                setId(size, value);

                UIStyles.setText(size, value);
                UIEvents.listen([size], "click", () => {
                  BrowseSelector.size(value);

                  UIClasses.toggle(size, ["selected"]);
                });
              });
            }
          });
        });
        UIElements.create(dropdowns, "div", (colors) => {
          UIClasses.add(colors, ["browse-filter-group"]);

          UIElements.create(colors, "h3", (title) => {
            UIStyles.setText(title, "Colors");
            UIClasses.set(title, [
              "is-size-6",
              "has-text-weight-semibold",
              "mb-2",
            ]);
          });
          UIElements.create(colors, "div", (contents) => {
            UIClasses.add(contents, ["browse-filter-options"]);

            for (const { name, hex } of types.colors) {
              UIElements.create(contents, "button", (color) => {
                setId(color, name);

                UIClasses.set(color, ["color-circle"]);
                UIStyles.setBackgroundColor(color, hex);
                UIAttributes.set(color, [["title", name]]);
                UIEvents.listen([color], "click", () => {
                  BrowseSelector.color(name);
                  UIClasses.toggle(color, ["selected"]);
                });
              });
            }
          });
        });
      });
    });
  },
  top(products, section) {
    UIElements.create(section, "div", (panel) => {
      UIClasses.set(panel, ["mb-5", "p-3", "browse-top-bar"]);
      UIElements.create(panel, "div", (sort) => {
        UIClasses.set(sort, [
          "is-flex",
          "is-align-items-center",
          "is-justify-content-flex-end",
          "mb-4",
        ]);
        UIElements.create(sort, "h3", (title) => {
          UIStyles.setText(title, "Sort By");
          UIClasses.set(title, [
            "is-size-6",
            "has-text-weight-semibold",
            "mr-3",
          ]);
          UIElements.create(sort, "select", (selection) => {
            UIClasses.set(selection, ["select", "is-small"]);

            Object.values(ProductSortingTypes).forEach((value) => {
              UIElements.create(selection, "option", (option) => {
                UIAttributes.set(option, [["value", value]]);
                UIStyles.setText(option, value);
              });
            });

            UIEvents.listen([selection], "change", (event) => {
              BrowseSelector.sort(event.target.value);
            });
          });
        });
        UIElements.create(panel, "div", (filters) => {
          UIClasses.set(filters, ["mb-4"]);
          UIElements.create(filters, "h3", (title) => {
            UIStyles.setText(title, "Filters");
            UIClasses.set(title, [
              "is-size-6",
              "has-text-weight-semibold",
              "mb-2",
            ]);
          });
          UIElements.create(filters, "button", (clear) => {
            UIStyles.setText(clear, "Clear All");
            UIClasses.set(clear, ["button", "is-small", "is-light", "mb-3"]);
            UIEvents.listen([clear], "click", () => {
              BrowseView.renew(products);
              UIElements.renew(Identifiers.FILTERS);
            });
          });
          UIElements.create(filters, "div", (contents) => {
            UIElements.setId(contents, Identifiers.FILTERS);
            UIClasses.set(contents, ["tags", "are-small"]);
          });
        });
      });
    });
  },
  overviews(section) {
    UIElements.create(section, "section", (section) => {
      UIElements.create(section, "div", (overviews) => {
        UIElements.setId(overviews, Identifiers.PRODUCT_OVERVIEWS);
      });
    });
  },
};
