import { ProductBrowsing } from "../api";
import {
  UIClasses,
  UIAttributes,
  UIElements,
  UIStyles,
  UIEvents,
} from "../utils";

export const ProductViewIdentifiers = {
  IMAGE_MAIN: "details-main-image",
  IMAGE_OTHER_SECOND: "details-other-second",
  IMAGE_OTHER_THIRD: "details-other-third",
  TITLE: "details-title",
  PRICE: "details-price",
  DESCRIPTION: "details-description",
  MATERIAL: "details-material",
  QUANTITY: "details-quantity",
  RECOMMENDATIONS: "details-recommendations",
};

export const ProductView = {
  create() {
    return UIElements.getByIds(["product"], (view) => {
      UIElements.create(view, "div", (images) => {
        UIElements.create(images, "img", (main) => {
          UIAttributes.set(main, [["src", "placeholder"]]);
          UIClasses.add(main, ["placeholder"]);
          UIElements.setId(main, ProductViewIdentifiers.IMAGE_MAIN);
        });
        UIElements.create(images, "img", (second) => {
          UIAttributes.set(second, [["src", "placeholder"]]);
          UIClasses.add(second, ["placeholder"]);
          UIElements.setId(second, ProductViewIdentifiers.IMAGE_OTHER_SECOND);
        });
        UIElements.create(images, "img", (third) => {
          UIAttributes.set(third, [["src", "placeholder"]]);
          UIClasses.add(third, ["placeholder"]);
          UIElements.setId(third, ProductViewIdentifiers.IMAGE_OTHER_THIRD);
        });
      });
      UIElements.create(view, "form", (details) => {
        UIElements.create(details, "h2", (title) => {
          UIElements.setId(title, ProductViewIdentifiers.TITLE);
        });
        UIElements.create(details, "h3", (price) => {
          UIElements.setId(price, ProductViewIdentifiers.PRICE);
        });
        UIElements.create(details, "p", (description) => {
          UIElements.setId(description, ProductViewIdentifiers.DESCRIPTION);
        });
        UIElements.create(details, "div", (material) => {
          UIElements.create(material, "p", (title) => {
            UIStyles.setText(title, "Material");
          });
          UIElements.create(material, "p", (value) => {
            UIElements.setId(value, ProductViewIdentifiers.MATERIAL);
          });
        });
        UIElements.create(details, "label", (quantity) => {
          UIStyles.setText(quantity, "Quantity");
          UIElements.create(quantity, "input", (value) => {
            UIElements.setId(value, ProductViewIdentifiers.QUANTITY);
            UIAttributes.set(value, [
              ["type", "number"],
              ["min", "1"],
              ["value", "1"],
            ]);
          });
        });
        UIElements.create(details, "input", (value) => {
          UIAttributes.set(value, [
            ["type", "submit"],
            ["value", "Add to Cart"],
          ]);
        });
        UIEvents.listen([details], "submit", () => {
          // cart
        });
      });
      UIElements.create(view, "section", (recommendations) => {
        UIClasses.set(recommendations, ["section"]);
        UIElements.setId(
          recommendations,
          ProductViewIdentifiers.RECOMMENDATIONS,
        );
      });
    });
  },
  show(product) {
    UIElements.getByIds([ProductViewIdentifiers.TITLE], (title) => {
      UIStyles.setText(title, product.name);
    });
    UIElements.getByIds([ProductViewIdentifiers.PRICE], (price) =>
      UIStyles.setText(price, product.price),
    );
    UIElements.getByIds([ProductViewIdentifiers.DESCRIPTION], (description) =>
      UIStyles.setText(description, product.description),
    );
    UIElements.getByIds([ProductViewIdentifiers.MATERIAL], (material) =>
      UIStyles.setText(material, product.material),
    );
    UIElements.getByIds(
      [ProductViewIdentifiers.RECOMMENDATIONS],
      async (recommendations) => {
        const related = await ProductBrowsing.getRecommendations(product, 4);

        if (related.ok) {
          ProductOverview.create(
            recommendations,
            "Related Products",
            related.data,
          );
        }
      },
    );
    UIElements.getByIds(["product"], (view) => {
      UIClasses.toggle(view, ["is-hidden"]);
    });
  },
};

export const ProductOverview = {
  create(parent, title, products) {
    return UIElements.create(parent, "div", (container) => {
      UIClasses.set(container, ["container"]);
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

        products.forEach((product, index) => {
          UIElements.create(columns, "div", (container) => {
            UIClasses.add(container, ["column", "is-one-quarter"]);
            UIElements.create(container, "div", (card) => {
              UIClasses.add(card, ["card"]);
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
                  UIStyles.setText(price, product.price);
                });
              });
            });
          });
        });
      });
    });
  },
};
