import { ShoppingCart } from "../api";
import {
  UIClasses,
  UIAttributes,
  UIElements,
  UIStyles,
  UIEvents,
  Validation,
  Result,
} from "../utils";

const Identifiers = {
  ORDERS: "cart-orders",
  SELECT_SHIPPING_TYPE: "cart-shipping-type",
  SELECT_SHIPPING_DEST: "cart-shipping-dest",
  SUMMARY_MERCH: "cart-summary-merch",
  SUMMARY_SHIPPING: "cart-summary-shipping",
  SUMMARY_TAX: "cart-summary-tax",
  SUMMARY_TOTAL: "cart-summary-total",
};

export const ShoppingCartView = {
  create(id) {
    return UIElements.getByIds([id], ([view]) => {
      UIElements.create(view, "div", (container) => {
        UIClasses.set(container, ["container", "mt-6"]);

        UIElements.create(container, "div", (columns) => {
          UIClasses.set(columns, ["columns", "is-variable", "is-8"]);

          UIElements.create(columns, "div", (left) => {
            UIClasses.set(left, ["column", "is-two-thirds"]);
            CreateSubviews.orders(left);
            CreateSubviews.shipping(left);
          });

          UIElements.create(columns, "div", (right) => {
            UIClasses.set(right, [
              "column",
              "is-one-third",
              "cart-summary-column",
            ]);
            CreateSubviews.summary(right);
          });
        });
      });
    });
  },
  update(order) {
    if (order) {
      ShoppingCart.order(order);
    }

    const summaries = {
      subtotal: 0,
      total: 0,
    };

    UpdateSubviews.orders(summaries);
    UpdateSubviews.summary(summaries);
  },
};

const UpdateSubviews = {
  orders(summaries) {
    Result.compute([ShoppingCart.get()], ([cart]) => {
      UIElements.renew(Identifiers.ORDERS, (orders) => {
        for (const [index, order] of Object.entries(cart)) {
          UIElements.create(orders, "div", (row) => {
            UIClasses.set(row, ["columns", "is-vcentered", "py-4", "cart-row"]);

            // IMAGE
            UIElements.create(row, "div", (colImg) => {
              UIClasses.set(colImg, ["column", "is-2"]);
              UIElements.create(colImg, "figure", (fig) => {
                UIClasses.set(fig, ["image", "is-96x96"]);
                UIElements.create(fig, "img", (thumbnail) => {
                  UIAttributes.set(thumbnail, [
                    ["src", "https://picsum.photos/200?" + index],
                  ]);
                  UIClasses.set(thumbnail);
                });
              });
            });

            // PRODUCT INFO
            UIElements.create(row, "div", (colInfo) => {
              UIClasses.set(colInfo, ["column", "is-4"]);

              UIElements.create(colInfo, "p", (title) => {
                UIClasses.set(title, ["cart-product-title", "mb-1"]);
                UIStyles.setText(title, order.name);
              });

              UIElements.create(colInfo, "p", (size) => {
                UIClasses.set(size, ["cart-detail"]);
                size.innerHTML = `<strong>Size:</strong> ${order.sizes.join(", ")}`;
              });

              UIElements.create(colInfo, "p", (color) => {
                UIClasses.set(color, ["cart-detail"]);

                color.innerHTML = `<strong>Color:</strong> ${order.color[0].name}`;
              });
            });

            // PRICE
            UIElements.create(row, "div", (colPrice) => {
              UIClasses.set(colPrice, ["column", "is-2", "has-text-right"]);
              UIElements.create(colPrice, "p", (price) => {
                UIStyles.setText(price, "$" + order.price.toFixed(2));
              });
            });

            // QUANTITY
            UIElements.create(row, "div", (colQty) => {
              UIClasses.set(colQty, ["column", "is-2", "has-text-centered"]);
              UIElements.create(colQty, "p", (quantity) => {
                UIStyles.setText(quantity, order.quantity);
              });
            });

            // SUBTOTAL
            UIElements.create(row, "div", (colSub) => {
              UIClasses.set(colSub, ["column", "is-2", "has-text-right"]);
              UIElements.create(colSub, "p", (subtotal) => {
                const value = order.price * order.quantity;
                summaries.subtotal += value;
                UIStyles.setText(subtotal, "$" + value.toFixed(2));
              });
            });
          });
        }
      });
    });
  },

  summary(summaries) {
    UIElements.renew(Identifiers.SUMMARY_MERCH, (merch) => {
      UIStyles.setText(merch, summaries.subtotal);
    });
    UIElements.getByIds(
      [Identifiers.SELECT_SHIPPING_TYPE, Identifiers.SELECT_SHIPPING_DEST],
      ([shipping, destination]) => {
        UIElements.renew(Identifiers.SUMMARY_SHIPPING, (text) => {
          Result.compute(
            [ShoppingCart.getShippingCost(shipping.value, destination.value)],
            ([cost]) => {
              summaries.total += cost;

              UIStyles.setText(text, cost);
            },
          );
        });
        UIElements.renew(Identifiers.SUMMARY_TAX, (text) => {
          Result.compute(
            [ShoppingCart.getTaxCost(destination.value, summaries.subtotal)],
            ([cost]) => {
              summaries.total += cost;

              UIStyles.setText(text, cost);
            },
          );
        });
      },
    );
    UIElements.renew(Identifiers.SUMMARY_TOTAL, (text) => {
      UIStyles.setText(text, (summaries.total += summaries.subtotal));
    });
  },
};

const CreateSubviews = {
  orders(view) {
    // WRAPPER
    UIElements.create(view, "div", (wrapper) => {
      UIClasses.set(wrapper, ["mb-4"]);

      // HEADER ROW
      UIElements.create(wrapper, "div", (header) => {
        UIClasses.set(header, [
          "columns",
          "is-hidden-touch",
          "py-3",
          "mb-3",
          "has-text-grey",
          "has-text-weight-semibold",
          "cart-header",
        ]);

        const labels = ["Product", "Price", "Qty", "Subtotal"];
        const sizes = [
          "column is-6",
          "column is-2",
          "column is-2 has-text-centered",
          "column is-2 has-text-right",
        ];

        labels.forEach((text, i) => {
          UIElements.create(header, "div", (col) => {
            UIClasses.set(col, sizes[i].split(" "));
            UIElements.create(col, "p", (p) => UIStyles.setText(p, text));
          });
        });
      });

      // REAL ORDERS LIST (this is the container that gets cleared + refilled)
      UIElements.create(wrapper, "div", (orders) => {
        UIElements.setId(orders, Identifiers.ORDERS);
      });
    });
  },

  shipping(view) {
    UIElements.create(view, "div", (shipping) => {
      UIClasses.set(shipping, ["shipping-section"]);
      UIElements.create(shipping, "select", (type) => {
        ["Standard", "Express", "Priority"].forEach((value, index) => {
          UIElements.create(type, "option", (option) => {
            UIAttributes.set(option, [["value", index]]);
            UIStyles.setText(option, value);
          });
        });
        UIElements.setId(type, Identifiers.SELECT_SHIPPING_TYPE);
        UIEvents.listen([type], "change", () => {
          this.show();
        });
      });
      UIElements.create(shipping, "select", (destination) => {
        ["Canada", "United States", "International"].forEach((value, index) => {
          UIElements.create(destination, "option", (option) => {
            UIAttributes.set(option, [["value", index]]);
            UIStyles.setText(option, value);
          });
        });
        UIElements.setId(destination, Identifiers.SELECT_SHIPPING_DEST);
        UIEvents.listen([destination], "change", () => {
          this.show();
        });
      });
    });
  },
  summary(view) {
    UIElements.create(view, "div", (summary) => {
      UIClasses.set(summary, ["summary"]);
      UIElements.create(summary, "div", (merch) => {
        UIElements.create(merch, "p", (title) => {
          UIStyles.setText(title, "Merchandise");
        });
        UIElements.create(merch, "p", (price) => {
          UIElements.setId(price, Identifiers.SUMMARY_MERCH);
        });
      });
      UIElements.create(summary, "div", (shipping) => {
        UIElements.create(shipping, "p", (title) => {
          UIStyles.setText(title, "Shipping");
        });
        UIElements.create(shipping, "p", (price) => {
          UIElements.setId(price, Identifiers.SUMMARY_SHIPPING);
        });
      });
      UIElements.create(summary, "div", (tax) => {
        UIElements.create(tax, "p", (title) => {
          UIStyles.setText(title, "Tax");
        });
        UIElements.create(tax, "p", (price) => {
          UIElements.setId(price, Identifiers.SUMMARY_TAX);
        });
      });
      UIElements.create(summary, "div", (total) => {
        UIElements.create(total, "p", (title) => {
          UIStyles.setText(title, "Total");
        });
        UIElements.create(total, "p", (price) => {
          UIElements.setId(price, Identifiers.SUMMARY_TOTAL);
        });
      });
      UIElements.create(summary, "label", (label) => {
        UIStyles.setText(label, "Checkout");
        UIElements.create(label, "input", (button) => {
          UIAttributes.set(button, [
            ["type", "button"],
            ["name", "checkout"],
          ]);
          UIEvents.listen([button], "onclick", () => {
            alert("Order placed!");
          });
        });
      });
    });
  },
};
