import { ProductBrowsing, ProductStorage } from "../api";
import { Routes } from "../routes";
import { showToast } from "../toast";
import {
  UIClasses,
  UIAttributes,
  UIElements,
  UIStyles,
  UIEvents,
  Result,
  Validation,
} from "../utils";

const Identifiers = {
  IMAGE_MAIN: "details-main-image",
  IMAGE_OTHER_SECOND: "details-other-second",
  IMAGE_OTHER_THIRD: "details-other-third",
  TITLE: "details-title",
  PRICE: "details-price",
  DESCRIPTION: "details-description",
  MATERIAL: "details-material",
  COLORS: "details-color",
  SIZES: "details-sizes",
  QUANTITY: "details-quantity",
  ADD_TO_CART: "details-add-to-cart",
  RECOMMENDATIONS: "details-recommendations",
};

function formatPrice(value) {
  return "$" + Number(value).toFixed(2);
}

export const ProductView = {
  create(product, id) {
    return UIElements.getByIds([id], ([view]) => {
      UIElements.create(view, "div", (container) => {
        UIClasses.set(container, [
          "columns",
          "is-variable",
          "is-8",
          "product-container",
        ]);

        // left side images
        CreateSubviews.images(container);

        // right side details
        CreateSubviews.details(container);
      });

      // recommendations under it
      CreateSubviews.recommendations(view);
    });
  },
  update(product) {
    UpdateSubview.details(product);
    UpdateSubview.recommendations(product);
    UpdateSubview.updateBreadcrumb(product);
  },
};

export const ProductOverview = {
  create(parent, title, products) {
    UIElements.create(parent, "div", (container) => {
      UIClasses.set(container, ["container, is-variable, is-8"]);

      UIElements.create(container, "h2", (header) => {
        UIClasses.add(header, [
          "title",
          "is-3",
          "has-text-weight-light",
          "mb-6",
        ]);
        UIStyles.setText(header, title);
      });
      UIElements.create(container, "div", (columns) => {
        UIClasses.add(columns, ["columns", "is-multiline"]);

        for (const [index, product] of Object.entries(products)) {
          UIElements.create(columns, "div", (container) => {
            UIClasses.add(container, ["column", "is-one-quarter"]);
            UIElements.create(container, "div", (card) => {
              UIClasses.add(card, ["card", "product-card"]);
              UIElements.create(card, "div", (imagec) => {
                UIClasses.add(imagec, ["card-image"]);
                UIElements.create(imagec, "figure", (figure) => {
                  UIClasses.add(figure, ["image", "is-3by4"]);
                  UIElements.create(figure, "img", (image) => {
                    UIAttributes.set(image, [
                      ["src", "https://picsum.photos/400?" + index],
                    ]);
                  });
                });
              });
              UIElements.create(card, "div", (content) => {
                UIClasses.add(content, ["card-content"]);
                UIElements.create(content, "p", (title) => {
                  UIClasses.add(title, [
                    "title",
                    "is-6",
                    "has-text-weight-light",
                  ]);
                  UIStyles.setText(title, product.name);
                });
                UIElements.create(content, "p", (price) => {
                  UIClasses.add(price, ["subtitle", "is-6", "has-text-grey"]);
                  UIStyles.setText(price, formatPrice(product.price));
                });
                UIElements.create(content, "a", (cart) => {
                  UIClasses.set(cart, ["cart-wrapper"]);
                  UIElements.create(cart, "span", (icon) => {
                    UIClasses.set(icon, ["icon"]);
                    UIElements.create(icon, "img", (img) => {
                      UIAttributes.set(img, [
                        ["src", "/src/images/CartIcon.png"],
                        ["alt", "Cart"],
                      ]);
                      UIClasses.set(img, "cart-icon");
                    });
                  });
                });
              });
              UIEvents.listen([card], "click", () => {
                Routes.product(product);
              });
            });
          });
        }
      });
    });
  },
};

const CreateSubviews = {
  breadcrumb(parent) {
    UIElements.create(parent, "nav", (nav) => {
      UIClasses.set(nav, ["breadcrumb", "has-succeeds-separator", "mb-4"]);

      UIElements.create(nav, "ul", (list) => {
        // Home
        UIElements.create(list, "li", (li) => {
          UIElements.create(li, "a", (a) => {
            UIStyles.setText(a, "Home");
          });
        });

        // Gender
        UIElements.create(list, "li", (li) => {
          UIElements.create(li, "a", (a) => {
            UIElements.setId(a, "breadcrumb-gender");
          });
        });

        // Category
        UIElements.create(list, "li", (li) => {
          UIElements.create(li, "a", (a) => {
            UIElements.setId(a, "breadcrumb-category");
          });
        });

        // Product (active)
        UIElements.create(list, "li", (li) => {
          UIElements.create(li, "a", (a) => {
            UIElements.setId(a, "breadcrumb-product");
          });
        });
      });
    });
  },

  images(view) {
    UIElements.create(view, "div", (images) => {
      UIClasses.set(images, ["column", "is-half"]);

      UIElements.create(images, "div", (wrapper) => {
        UIClasses.add(wrapper, ["columns", "is-multiline"]);

        UIElements.create(wrapper, "div", (colMain) => {
          UIClasses.add(colMain, ["column", "is-12"]);

          UIElements.create(colMain, "figure", (fig) => {
            UIClasses.add(fig, ["image", "is-3by2"]);

            UIElements.create(fig, "img", (img) => {
              UIAttributes.set(img, [["src", "https://picsum.photos/600?0"]]);
              UIAttributes.set(img, [["id", Identifiers.IMAGE_MAIN]]);
              UIClasses.add(img, ["product-main"]);
            });
          });
        });

        UIElements.create(wrapper, "div", (colThumb1) => {
          UIClasses.add(colThumb1, ["column", "is-6"]);

          UIElements.create(colThumb1, "figure", (fig) => {
            UIClasses.add(fig, ["image", "is-square"]);

            UIElements.create(fig, "img", (img) => {
              UIAttributes.set(img, [["src", "https://picsum.photos/400?1"]]);
              UIAttributes.set(img, [["id", Identifiers.IMAGE_OTHER_SECOND]]);
              UIClasses.add(img, ["product-thumb"]);
            });
          });
        });

        UIElements.create(wrapper, "div", (colThumb2) => {
          UIClasses.add(colThumb2, ["column", "is-6"]);

          UIElements.create(colThumb2, "figure", (fig) => {
            UIClasses.add(fig, ["image", "is-square"]);

            UIElements.create(fig, "img", (img) => {
              UIAttributes.set(img, [["src", "https://picsum.photos/400?2"]]);
              UIAttributes.set(img, [["id", Identifiers.IMAGE_OTHER_THIRD]]);
              UIClasses.add(img, ["product-thumb"]);
            });
          });
        });
      });
    });
  },

  details(view) {
    UIElements.create(view, "div", (details) => {
      UIClasses.set(details, ["column", "is-half", "product-details"]);

      CreateSubviews.breadcrumb(details);

      UIElements.create(details, "h1", (title) => {
        UIClasses.set(title, ["title", "is-2"]);
        UIElements.setId(title, Identifiers.TITLE);
      });

      UIElements.create(details, "p", (price) => {
        UIClasses.set(price, ["title", "is-4", "has-text-weight-semibold"]);
        UIElements.setId(price, Identifiers.PRICE);
      });

      UIElements.create(details, "div", (divider) => {
        UIClasses.add(divider, ["price-divider"]);
      });

      UIElements.create(details, "p", (desc) => {
        UIClasses.add(desc, ["product-description"]);
        UIElements.setId(desc, Identifiers.DESCRIPTION);
      });

      UIElements.create(details, "div", (divider) => {
        UIClasses.add(divider, ["price-divider"]);
      });

      // Material
      UIElements.create(details, "p", (material) => {
        UIClasses.set(material, ["mt-3"]);
        UIElements.create(material, "strong", (label) => {
          UIStyles.setText(label, "Material: ");

          UIElements.create(material, "span", (value) => {
            UIElements.setId(value, Identifiers.MATERIAL);
          });
        });
      });

      UIElements.create(details, "div", (container) => {
        UIElements.create(container, "div", (colors) => {
          UIClasses.set(colors, ["placeholder"]);
          UIElements.setId(colors, Identifiers.COLORS);
        });

        UIElements.create(container, "div", (sizes) => {
          UIClasses.set(sizes, ["placeholder"]);
          UIElements.setId(sizes, Identifiers.SIZES);
        });
      });

      // Quantity
      UIElements.create(details, "div", (quantity) => {
        UIClasses.set(quantity, ["quantity-row", "mt-4"]);

        UIElements.create(quantity, "label", (label) => {
          UIClasses.set(label, ["label", "mr-3"]);
          UIStyles.setText(label, "Quantity:");
        });

        UIElements.create(quantity, "input", (input) => {
          UIClasses.set(input, ["input", "quantity-input"]);
          UIAttributes.set(input, [
            ["type", "number"],
            ["value", "1"],
            ["min", "1"],
            ["id", Identifiers.QUANTITY],
          ]);
        });
      });

      // Add to Cart button
      UIElements.create(details, "button", (button) => {
        UIClasses.set(button, ["button", "is-black", "is-medium", "mt-4"]);
        UIStyles.setText(button, "Add to Cart");
        UIElements.setId(button, Identifiers.ADD_TO_CART);
        UIEvents.listen([button], "click", () => {
          Result.compute([ProductStorage.fetch()], ([products]) => {
            let selection = {};

            UIClasses.select(`#${Identifiers.COLORS} .selected`).map(
              (selected) => {
                const [name, hex] = UIAttributes.get(selected, ["name", "hex"]);
                const color = { name, hex };
                const array = selection.color;

                if (!array) {
                  selection.color = [color];
                } else {
                  array.push(color);
                }
              }
            );
            UIClasses.select(`#${Identifiers.SIZES} .selected`).map(
              (selected) => {
                Result.compute([UIStyles.getText(selected)], ([size]) => {
                  const array = selection.sizes;

                  if (!array) {
                    selection.sizes = [size];
                  } else {
                    array.push(size);
                  }
                });
              }
            );
            UIElements.getByIds([Identifiers.QUANTITY], ([quantity]) => {
              Result.compute(
                [Validation.getNumber(quantity.value)],
                ([value]) => {
                  selection.quantity = value;
                }
              );
            });

            const [id] = UIAttributes.get(button, ["product"]);

            Result.compute(
              [ProductBrowsing.getById(products, id)],
              ([product]) => {
                Routes.cart({ product, selection });

                showToast("Product added to cart!");
              }
            );
          });
        });
      });
    });
  },

  recommendations(view) {
    UIElements.create(view, "section", (recommendations) => {
      UIClasses.set(recommendations, ["section"]);
      UIElements.setId(recommendations, Identifiers.RECOMMENDATIONS);
    });
  },
};

const UpdateSubview = {
  updateBreadcrumb(product) {
    // Product
    UIElements.getByIds(["breadcrumb-product"], ([el]) => {
      UIStyles.setText(el, product.name);
    });

    // Gender
    UIElements.getByIds(["breadcrumb-gender"], ([el]) => {
      const gender =
        product.gender.charAt(0).toUpperCase() + product.gender.slice(1);
      UIStyles.setText(el, gender);
      UIEvents.listen([el], "click", () => Routes.browseGender(product.gender));
    });

    // Category
    UIElements.getByIds(["breadcrumb-category"], ([el]) => {
      UIStyles.setText(el, product.category);
      UIEvents.listen([el], "click", () =>
        Routes.browseCategory(product.gender, product.category)
      );
    });
  },

  details(product) {
    UIElements.getByIds([Identifiers.TITLE], ([title]) => {
      UIStyles.setText(title, product.name);
    });
    UIElements.getByIds([Identifiers.PRICE], ([price]) => {
      UIStyles.setText(price, formatPrice(product.price));
    });
    UIElements.getByIds([Identifiers.DESCRIPTION], ([description]) => {
      UIStyles.setText(description, product.description);
    });
    UIElements.getByIds([Identifiers.MATERIAL], ([material]) => {
      UIStyles.setText(material, product.material);
    });
    UIElements.renew(Identifiers.COLORS, (colors) => {
      UIElements.create(colors, "p", (label) => {
        UIClasses.set(label, ["label", "mt-4"]);
        UIStyles.setText(label, "Color");
      });
      UIElements.create(colors, "div", (boxes) => {
        Result.compute([Validation.getArray(product.color)], ([values]) => {
          for (const value of values) {
            UIElements.create(boxes, "button", (box) => {
              UIClasses.set(box, ["color-button"]);
              UIAttributes.set(box, [
                ["name", value.name],
                ["hex", value.hex],
              ]);
              UIStyles.setBackgroundColor(box, value.hex);
              UIEvents.listen([box], "click", () => {
                Result.compute([UIElements.getChildrens(boxes)], ([boxes]) => {
                  if (boxes.length > 1) {
                    for (const box of boxes) {
                      UIClasses.remove(box, ["selected"]);
                    }
                  }
                });

                UIClasses.toggle(box, ["selected"]);
              });
            });
          }
        });
      });
    });
    UIElements.renew(Identifiers.SIZES, (sizes) => {
      UIElements.create(sizes, "p", (label) => {
        UIClasses.set(label, ["label", "mt-4"]);
        UIStyles.setText(label, "Size");
      });
      UIElements.create(sizes, "div", (boxes) => {
        Result.compute([Validation.getArray(product.sizes)], ([values]) => {
          for (const value of values) {
            UIElements.create(boxes, "button", (box) => {
              UIClasses.set(box, ["size-button"]);
              UIStyles.setText(box, value);
              UIEvents.listen([box], "click", () => {
                Result.compute([UIElements.getChildrens(boxes)], ([boxes]) => {
                  if (boxes.length > 1) {
                    for (const box of boxes) {
                      UIClasses.remove(box, ["selected"]);
                    }
                  }
                });

                UIClasses.toggle(box, ["selected"]);
              });
            });
          }
        });
      });
    });
    UIElements.getByIds([Identifiers.ADD_TO_CART], ([button]) => {
      UIAttributes.set(button, [["product", product.id]]);
    });
  },
  recommendations(product) {
    UIElements.renew(Identifiers.RECOMMENDATIONS, (recommendations) => {
      Result.compute(
        [ProductBrowsing.getRecommendations(product, 4)],
        ([products]) => {
          ProductOverview.create(recommendations, "Related Products", products);
        }
      );
    });
  },
};
