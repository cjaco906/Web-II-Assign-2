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
         UIClasses.set(section, ["columns", "mt-6"]) 

 UIElements.create(section, "div", left => {
        UIClasses.set(left, ["column", "is-3"])
        CreateSubview.departments(left, products)

          UIElements.create(section, "div", right => {
        UIClasses.set(right, ["column", "is-9"])
        CreateSubview.top(right, products)
        CreateSubview.overviews(right, products)
      });
    });
  });
  });
  },
  update() {},
};

const CreateSubview = {
  departments(section) {
    UIElements.create(section, "div", (panel) => {
       UIClasses.set(panel, ["box", "p-5", "mb-5", "browse-sidebar"])
      UIElements.create(panel, "h2", (title) => {
       
        UIStyles.setText(title, "Departments");
         UIClasses.set(title, ["is-size-5", "has-text-weight-bold", "mb-4"]);
      });
      UIElements.create(panel, "div", (dropdowns) => {
        const types = ProductBrowsing.getTypes();

        UIElements.create(dropdowns, "div", (genders) => {
           UIClasses.add(genders, ["mb-5"]); 
          UIElements.create(genders, "h3", (title) => {
            UIStyles.setText(title, "Gender");
            UIClasses.set(title, ["is-size-6", "has-text-weight-semibold", "mb-2"]);
          });
          UIElements.create(genders, "div", (contents) => {
             UIClasses.add(contents, ["buttons", "are-small", "are-rounded"]);
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
          UIClasses.add(categories, ["mb-5"]);
          UIElements.create(categories, "h3", (title) => {
            UIStyles.setText(title, "Category");
            UIClasses.set(title, ["is-size-6", "has-text-weight-semibold", "mb-2"]);
          });
          UIElements.create(categories, "div", (contents) => {
            UIClasses.add(contents, ["buttons", "are-small", "are-rounded"]);
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
          UIClasses.add(sizes, ["mb-5"]);
          UIElements.create(sizes, "h3", (title) => {
            UIStyles.setText(title, "Size");
            UIClasses.set(title, ["is-size-6", "has-text-weight-semibold", "mb-2"]);
          });

          UIElements.create(sizes, "div", (contents) => {
            UIClasses.add(contents, ["buttons", "are-small", "are-rounded"]);
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
          UIClasses.add(colors, ["mb-5"]);
          UIElements.create(colors, "h3", (title) => {
            UIStyles.setText(title, "Size");
            UIClasses.set(title, ["is-size-6", "has-text-weight-semibold", "mb-2"]);
          });
          UIElements.create(colors, "div", (contents) => {
            UIClasses.add(contents, ["buttons", "are-small", "are-rounded"]);
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
      UIClasses.set(panel, ["mb-5", "p-3", "browse-top-bar"]);
      UIElements.create(panel, "div", (sort) => {
        UIClasses.set(sort, [
        "is-flex",
        "is-align-items-center",
        "is-justify-content-space-between",
        "mb-4"
      ]);
        UIElements.create(sort, "h3", (title) => {
          UIStyles.setText(title, "Sort");
          UIClasses.set(title, ["is-size-6", "has-text-weight-semibold", "mr-3"]);
        });
        UIElements.create(sort, "select", (selection) => {
          UIClasses.set(selection, ["select", "is-small"]);
          ["Name", "Price", "Category"].forEach((value, index) => {
            UIElements.create(selection, "option", (option) => {
              UIAttributes.set(option, ["value", index]);
              UIStyles.setText(option, value);
            });
          });
        });
      });
      UIElements.create(panel, "div", (filters) => {
        UIClasses.set(filters, ["mb-4"]);
        UIElements.create(filters, "h3", (title) => {
          UIStyles.setText(title, "Filters");
          UIClasses.set(title, ["is-size-6", "has-text-weight-semibold", "mb-2"]);
        });
        UIElements.create(filters, "button", (clear) => {
          UIStyles.setText(clear, "Clear All");
          UIClasses.set(clear, ["button", "is-small", "is-light", "mb-3"]);
          UIEvents.listen([clear], "click", () => {
            UIElements.renew(Identifiers.FILTERS);
          });
        });
        UIElements.create(filters, "div", (contents) => {
          UIElements.setId(contents, Identifiers.FILTERS);
          UIClasses.set(contents, ["tags", "are-small"]);
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
