import { Result, UIClasses, UIElements, UIEvents } from "./utils";
import { HomeView, ProductView, ShoppingCartView } from "./views";
import { BrowseView } from "./views/browse";

const Views = {
  HOME: HomeView.create("home"),
  PRODUCT: ProductView.create("product"),
  CART: ShoppingCartView.create("shopping-cart"),
  BROWSE: BrowseView.create("browse"),
};

const NavigationBar = {
  HOME: UIElements.getByIds(["nav-home"]),
  HOME_LOGO: UIElements.getByIds(["nav-home-logo"]),
  BROWSE: UIElements.getByIds(["nav-browse"]),
  ABOUT_US: UIElements.getByIds(["nav-about"]),
  CART: UIElements.getByIds(["nav-cart"]),
};

const Router = {
  view: null,
};

export const Routes = {
  init(products) {
    Result.compute(
      [...NavigationBar.HOME, ...NavigationBar.HOME_LOGO],
      ([home, logo]) => {
        UIEvents.listen([home, logo], "click", () => {
          this.home(products);
        });
      },
    );
    Result.compute([...NavigationBar.BROWSE], ([browse]) => {
      UIEvents.listen([browse], "click", () => {
        this.browse();
      });
    });
    Result.compute([...NavigationBar.ABOUT_US], ([aboutus]) => {
      UIEvents.listen([aboutus], "click", () => {
        console.log("test");
      });
    });
    Result.compute([...NavigationBar.CART], ([cart]) => {
      UIEvents.listen([cart], "click", () => {
        this.cart();
      });
    });
  },
  home(products) {
    HomeView.update(products);
    UpdateView.switch(Views.HOME);
  },
  aboutus() { },
  browse() {
    BrowseView.update();
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

const UpdateView = {
  switch([{ data: view }]) {
    if (view) {
      if (Router.view) {
        UIClasses.toggle(view, ["is-hidden"]);
      }

      UIClasses.toggle(Router.view ?? view, ["is-hidden"]);
      Router.view = view;
    }
  },
};
