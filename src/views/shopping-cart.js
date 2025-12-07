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
  VIEW: "shopping-cart",
  ORDERS: "cart-orders",
  SELECT_SHIPPING_TYPE: "cart-shipping-type",
  SELECT_SHIPPING_DEST: "cart-shipping-dest",
  SUMMARY_MERCH: "cart-summary-merch",
  SUMMARY_SHIPPING: "cart-summary-shipping",
  SUMMARY_TAX: "cart-summary-tax",
  SUMMARY_TOTAL: "cart-summary-total",
};

export const ShoppingCartView = {
  create() {
    UIElements.getByIds([Identifiers.VIEW], ([view]) => {
      CreateSubviews.items(view);
      CreateSubviews.shipping(view);
      CreateSubviews.summary(view);
    });
  },
  show() {
    const summaries = {
      subtotal: 0,
      total: 0,
    };

    UpdateSubviews.items(summaries);
    UpdateSubviews.summary(summaries);
  },
};

const UpdateSubviews = {
  items(summaries) {
    Result.satisfy([ShoppingCart.get()], (cart) => {
      UIElements.renew(Identifiers.ORDERS, (orders) => {
        for (const [index, order] of Object.entries(cart)) {
          UIElements.create(orders, "div", (row) => {
            UIClasses.set(orders, ["cart-row"]);
            UIElements.create(row, "img", (thumbnail) => {
              UIAttributes.set(thumbnail, [
                ["src", "https://picsum.photos/400?" + index],
              ]);
              UIClasses.set(thumbnail, ["cart-thumb"]);
            });
            UIElements.create(row, "p", (title) => {
              UIStyles.setText(title, order.name);
            });
            UIElements.create(row, "div", (sizes) => {
              Result.satisfy([Validation.getArray(order.sizes)], (values) => {
                for (const value of values) {
                  UIElements.create(sizes, "p", (size) => {
                    UIStyles.setText(size, value);
                  });
                }
              });
            });
            UIElements.create(row, "div", (colors) => {
              Result.satisfy([Validation.getArray(order.colors)], (values) => {
                for (const value of values) {
                  UIElements.create(colors, "p", (color) => {
                    UIStyles.setText(color, value);
                  });
                }
              });
            });
            UIElements.create(row, "p", (price) => {
              UIStyles.setText(price, order.price);
            });
            UIElements.create(row, "p", (quantity) => {
              UIStyles.setText(quantity, order.quantity);
            });
            UIElements.create(row, "p", (subtotal) => {
              const value = order.price * order.unit;

              summaries.subtotal += value;

              UIStyles.setText(subtotal, value);
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
          Result.satisfy(
            [ShoppingCart.getShippingCost(shipping.value, destination.value)],
            (cost) => {
              summaries.total += cost;

              UIStyles.setText(text, cost);
            },
          );
        });
        UIElements.renew(Identifiers.SUMMARY_TAX, (text) => {
          Result.satisfy(
            [ShoppingCart.getTaxCost(destination.value, summaries.subtotal)],
            (cost) => {
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
  items(view) {
    UIElements.create(view, "div", (items) => {
      UIElements.setId(items, "cart-items");
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
