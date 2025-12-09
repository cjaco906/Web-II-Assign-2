import { ProductStorage } from "./api";
import { Result, UIClasses, UIElements, UIEvents } from "./utils";
import {
  HomeView,
  ProductView,
  ShoppingCartView,
  BrowseView,
  AboutUsView,
} from "./views";

export const Routes = Result.compute([ProductStorage.fetch()], ([products]) => {
  const Views = {
    HOME: HomeView.create(products, "home"),
    PRODUCT: ProductView.create(products, "product"),
    CART: ShoppingCartView.create(products, "shopping-cart"),
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
  const methods = {
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
        methods.home(products);
      });
    },
  );
  Result.compute([...NavigationBar.BROWSE], ([browse]) => {
    UIEvents.listen([browse], "click", () => {
      methods.browse(products);
    });
  });
  Result.compute([...NavigationBar.ABOUT_US], ([aboutus]) => {
    UIEvents.listen([aboutus], "click", () => {
      methods.aboutus();
    });
  });
  Result.compute([...NavigationBar.CART], ([cart]) => {
    UIEvents.listen([cart], "click", () => {
      methods.cart();
    });
  });

  return methods;
});

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
