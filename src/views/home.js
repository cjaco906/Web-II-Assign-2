import { UIClasses, UIAttributes, UIElements, UIStyles } from "../utils";
import { ProductOverview } from "./product";

const Identifiers = {
  FEATURED_PICKS: "home-featured-picks",
  BUTTON_BROWSE: "home-browse-button",
  BUTTON_ABOUT_US: "home-about-us",
};

export const HomeView = {
  create(id) {
    return UIElements.getByIds([id], ([view]) => {
      CreateSubviews.hero(view);
      CreateSubviews.featured(view);
    });
  },
  update(products) {
    UpdateSubviews.picks(products);
  },
};

const CreateSubviews = {
  featured(view) {
    UIElements.create(view, "section", (featured) => {
      UIClasses.set(featured, ["section"]);
      UIElements.setId(featured, Identifiers.FEATURED_PICKS);
    });
  },
  hero(view) {
    UIElements.create(view, "section", (container) => {
      UIClasses.set(container, ["section", "py-0", "mt-4"]);
      UIElements.create(container, "div", (container) => {
        UIClasses.set(container, ["container"]);
        UIElements.create(container, "div", (container) => {
          UIClasses.set(container, ["columns is-vcentered"]);
          UIElements.create(container, "div", (container) => {
            UIClasses.set(container, ["column", "is-6"]);
            UIElements.create(container, "h1", (title) => {
              UIClasses.set(title, [
                "title",
                "is-1",
                "has-text-weight-light",
                "mb-4",
              ]);
              UIStyles.setText(title, "Welcome to RAMAN");
            });
            UIElements.create(container, "p", (subtitle) => {
              UIClasses.set(subtitle, [
                "subtitle",
                "is-4",
                "has-text-grey",
                "mb-5",
              ]);
              UIStyles.setText(subtitle, "Best Quality Clothes in the World");
            });
            UIElements.create(container, "div", (buttons) => {
              UIClasses.set(buttons, ["buttons"]);
              UIElements.create(buttons, "button", (browse) => {
                UIClasses.set(browse, ["button", "is-black", "is-medium"]);
                UIStyles.setText(browse, "Browse Products");
                UIElements.setId(browse, Identifiers.BROWSE);
              });
              UIElements.create(buttons, "button", (aboutus) => {
                UIClasses.set(aboutus, ["button", "is-black", "is-medium"]);
                UIStyles.setText(aboutus, "Browse Products");
                UIElements.setId(aboutus, Identifiers.BUTTON_ABOUT_US);
              });
            });
          });
          UIElements.create(container, "div", (container) => {
            UIClasses.set(container, ["column", "is-6"]);
            UIElements.create(container, "figure", (figure) => {
              UIClasses.set(figure, ["image", "is-4by5"]);
              UIElements.create(figure, "img", (image) => {
                UIClasses.set(image, ["hero-right-side-image"]);
                UIAttributes.set(image, [
                  ["src", "/src/images/background.webp"],
                  ["alt", "Fashion Model"],
                ]);
              });
            });
          });
        });
      });
    });
  },
};

const UpdateSubviews = {
  picks(products) {
    UIElements.getByIds([Identifiers.FEATURED_PICKS], ([picks]) => {
      // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
      const limit = 4;
      const range = Math.random() * (products.length + limit);

      ProductOverview.create(
        picks,
        "Featured Picks",
        products.slice(range, range + limit),
      );
    });
  },
};
