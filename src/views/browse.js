import { ProductBrowsing } from "../api";
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
    const submit = (set, value) => {
      set.add(value);

      UIElements.getByIds([Identifiers.FILTERS], ([filters]) => {
        UIElements.create(filters, "button", (filter) => {
          UIStyles.setText(filter, value);
          UIEvents.listen([filter], "click", () => {
            filter.remove();
          });
        });
      });
      UIElements.renew(Identifiers.PRODUCT_OVERVIEWS, (overviews) => {
        Result.compute(
          [ProductBrowsing.getBySearch(products, selection, 10)],
          ([products]) => {
            ProductOverview.create(overviews, "Products", products);
          },
        );
      });
    };

    BrowseSelector = {
      gender(gender) {
        submit(selection.genders, gender);
      },
      category(category) {
        submit(selection.categories, category);
      },
      size(size) {
        submit(selection.sizes, size);
      },
      color(color) {
        submit(selection.colors, color);
      },
      sort(type) {
        selection.sort = type;
      },
    };
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
                UIStyles.setText(gender, value);
                UIStyles.setButtonToggleable(contents, gender);
                UIEvents.listen([gender], "click", () => {
                  BrowseSelector.gender(value);
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
                UIStyles.setText(category, value);
                UIStyles.setButtonToggleable(contents, category);
                UIEvents.listen([category], "click", () => {
                  BrowseSelector.category(value);
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
                UIStyles.setText(size, value);
                UIStyles.setButtonToggleable(contents, size);
                UIEvents.listen([size], "click", () => {
                  BrowseSelector.size(value);
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
                UIClasses.set(color, ["color-circle"]);
UIStyles.setBackgroundColor(color, hex);
UIAttributes.set(color, [["title", name]]);
                UIStyles.setButtonToggleable(contents, color);
                UIEvents.listen([color], "click", () => {
                  BrowseSelector.color(name);
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
          "is-justify-content-space-between",
          "mb-4",
        ]);
        UIElements.create(sort, "h3", (title) => {
          UIStyles.setText(title, "Sort");
          UIClasses.set(title, [
            "is-size-6",
            "has-text-weight-semibold",
            "mr-3",
          ]);
        });
        UIElements.create(sort, "select", (selection) => {
          UIClasses.set(selection, ["select", "is-small"]);

          ["Name", "Price", "Category"].forEach((value, index) => {
            UIElements.create(selection, "option", (option) => {
              UIAttributes.set(option, [["value", index]]);
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
  },
  overviews(section) {
    UIElements.create(section, "section", (section) => {
      UIElements.create(section, "div", (overviews) => {
        UIElements.setId(overviews, Identifiers.PRODUCT_OVERVIEWS);
      });
    });
  },
};
