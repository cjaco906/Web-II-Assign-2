import { ProductBrowsing } from "../api";
import {
  Result,
  UIAttributes,
  UIClasses,
  UIElements,
  UIEvents,
  UIStyles,
} from "../utils";

const Identifiers = {
  DROPDOWN_GENDERS: "browse-genders",
  DROPDOWN_CATEGORIES: "browse-categories",
  DROPDOWN_SIZES: "browse-sizes",
  DROPDOWN_COLORS: "browse-colors",
  FILTERS: "browse-filters",
  SELECTION_SORT: "browse-sort-select",
  PRODUCT_OVERVIEWS: "browse-product-overviews",
};

export const BrowseView = {
  create(id, products) {
    return UIElements.getByIds([id], ([view]) => {
      UIElements.create(view, "section", (section) => {
        CreateSubview.departments(section, products);
        CreateSubview.top(section, products);
        CreateSubview.overviews(section, products);
      });
    });
  },
  update() {},
};

const CreateSubview = {
  departments(section) {
    UIElements.create(section, "div", (panel) => {
      UIElements.create(panel, "h2", (title) => {
        UIStyles.setText(title, "Departments");
      });
      UIElements.create(panel, "div", (dropdowns) => {
        const types = ProductBrowsing.getTypes();

        UIElements.create(dropdowns, "div", (genders) => {
          UIElements.create(genders, "h3", (title) => {
            UIStyles.setText(title, "Gender");
          });
          UIElements.create(genders, "div", (contents) => {
            for (const value of types.genders) {
              UIElements.create(contents, "button", (gender) => {
                UIStyles.setText(gender, value);
                UIStyles.setButtonToggleable(contents, gender);
                UIEvents.listen([gender], "click", () => {});
              });
            }
          });
        });
        UIElements.create(dropdowns, "div", (categories) => {
          UIElements.create(categories, "h3", (title) => {
            UIStyles.setText(title, "Category");
          });
          UIElements.create(categories, "div", (contents) => {
            for (const value of types.categories) {
              UIElements.create(contents, "button", (category) => {
                UIStyles.setText(category, value);
                UIStyles.setButtonToggleable(contents, category);
                UIEvents.listen([category], "click", () => {});
              });
            }
          });
        });
        UIElements.create(dropdowns, "div", (sizes) => {
          UIElements.create(sizes, "h3", (title) => {
            UIStyles.setText(title, "Size");
          });
          UIElements.create(sizes, "div", (contents) => {
            for (const value of types.sizes) {
              UIElements.create(contents, "button", (size) => {
                UIStyles.setText(size, value);
                UIStyles.setButtonToggleable(contents, size);
                UIEvents.listen([size], "click", () => {});
              });
            }
          });
        });
        UIElements.create(dropdowns, "div", (colors) => {
          UIElements.create(colors, "h3", (title) => {
            UIStyles.setText(title, "Size");
          });
          UIElements.create(colors, "div", (contents) => {
            for (const value of types.colors) {
              UIElements.create(contents, "button", (color) => {
                UIStyles.setText(color, value);
                UIStyles.setButtonToggleable(contents, color);
                UIEvents.listen([color], "click", () => {});
              });
            }
          });
        });
      });
    });
  },
  top(section) {
    UIElements.create(section, "div", (panel) => {
      UIElements.create(panel, "div", (sort) => {
        UIElements.create(sort, "h3", (title) => {
          UIStyles.setText(title, "Sort");
        });
        UIElements.create(sort, "select", (selection) => {
          ["Name", "Price", "Category"].forEach((value, index) => {
            UIElements.create(selection, "option", (option) => {
              UIAttributes.set(option, ["value", index]);
              UIStyles.setText(option, value);
            });
          });
        });
      });
      UIElements.create(panel, "div", (filters) => {
        UIElements.create(filters, "h3", (title) => {
          UIStyles.setText(title, "Filters");
        });
        UIElements.create(filters, "button", (clear) => {
          UIStyles.setText(clear, "Clear All");
          UIEvents.listen([clear], "click", () => {
            UIElements.renew(Identifiers.FILTERS);
          });
        });
        UIElements.create(filters, "div", (contents) => {
          UIElements.setId(contents, Identifiers.FILTERS);
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

const UpdateSubview = {
  departments(products) {},
  top(products) {},
  overviews(products) {},
};
