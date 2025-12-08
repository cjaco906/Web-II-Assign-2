import { Result, UIClasses, UIElements, UIEvents } from "./utils";
import { HomeView, ProductView, ShoppingCartView } from "./views";

const Views = {
  HOME: HomeView.create("home"),
  PRODUCT: ProductView.create("product"),
  CART: ShoppingCartView.create("shopping-cart"),
};

const NavigationBar = {
  HOME: UIElements.getByIds(["nav-home"]),
  HOME_LOGO: UIElements.getByIds(["nav-home-logo"]),
  BROWSE: UIElements.getByIds(["nav-browse"]),
  ABOUT_US: UIElements.getByIds(["nav-about"]),
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
        console.log("test");
      });
    });
    Result.compute([...NavigationBar.ABOUT_US], ([aboutus]) => {
      UIEvents.listen([aboutus], "click", () => {
        console.log("test");
      });
    });
  },
  home(products) {
    HomeView.update(products);
    UpdateView.toggle(Views.HOME);
  },
  aboutus() { },
  browse() { },
  product(product) {
    ProductView.update(product);
    UpdateView.toggle(Views.PRODUCT);
  },
  cart(order) {
    ShoppingCartView.update(order);
    UpdateView.toggle(Views.CART);
  },
};

const UpdateView = {
  toggle([{ data: view }]) {
    if (view) {
      if (Router.view) {
        UIClasses.toggle(view, ["is-hidden"]);
      }

      UIClasses.toggle(Router.view ?? view, ["is-hidden"]);
      Router.view = view;
    }
  },
};
