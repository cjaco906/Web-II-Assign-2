import { ProductStorage } from "./api";
import { Result, UIClasses, UIElements, UIEvents } from "./utils";
import {
  AboutUsView,
  BrowseView,
  HomeView,
  ProductView,
  ShoppingCartView,
} from "./views";

/**
 * Responsible for allowing other parts of the website for switching between views.
 */
export const Routes = Result.compute([ProductStorage.fetch()], ([products]) => {
  const Views = {
    HOME: HomeView.create("home"),
    PRODUCT: ProductView.create("product"),
    CART: ShoppingCartView.create("shopping-cart"),
    BROWSE: BrowseView.create(products, "browse"),
    ABOUT_US: AboutUsView.create("about-us"),
  };
  const NavigationBar = {
    HOME: UIElements.getByIds(["nav-home"]),
    HOME_LOGO: UIElements.getByIds(["nav-home-logo"]),
    BROWSE: UIElements.getByIds(["nav-browse"]),
    ABOUT_US: UIElements.getByIds(["nav-about"]),
    CART: UIElements.getByIds(["nav-cart"]),
  };
  const paths = {
    home() {
      HomeView.update(products);
      UpdateView.switch(Views.HOME);
    },
    aboutus() {
      Result.compute([...Views.ABOUT_US], ([aboutus]) => {
        aboutus.showModal();
      });
    },
    browse() {
      BrowseView.renew(products);
      UpdateView.switch(Views.BROWSE);
    },
    product(product) {
      ProductView.update(product);
      UpdateView.switch(Views.PRODUCT);
    },
    cart(order) {
      ShoppingCartView.update(order);
      UpdateView.switch(Views.CART);
    },
  };

  Result.compute(
    [...NavigationBar.HOME, ...NavigationBar.HOME_LOGO],
    ([home, logo]) => {
      UIEvents.listen([home, logo], "click", () => {
        paths.home(products);
      });
    },
  );
  Result.compute([...NavigationBar.BROWSE], ([browse]) => {
    UIEvents.listen([browse], "click", () => {
      paths.browse(products);
    });
  });
  Result.compute([...NavigationBar.ABOUT_US], ([aboutus]) => {
    UIEvents.listen([aboutus], "click", () => {
      paths.aboutus();
    });
  });
  Result.compute([...NavigationBar.CART], ([cart]) => {
    UIEvents.listen([cart], "click", () => {
      paths.cart();
    });
  });

  return paths;
});

/**
 * Helper functions for switching views.
 */
const UpdateView = {
  selected: null,
  // https://stackoverflow.com/questions/1144805/scroll-to-the-top-of-the-page-using-javascript
  switch([{ data: selected }]) {
    if (selected) {
      window.scrollTo(0, 0);

      if (this.selected) {
        UIClasses.toggle(selected, ["is-hidden"]);
      }

      UIClasses.toggle(this.selected ?? selected, ["is-hidden"]);
      this.selected = selected;
    }
  },
};
