import { UIClasses } from "./utils";
import { HomeView, ProductView, ShoppingCartView } from "./views";

const Views = {
  home: HomeView.create("home"),
  product: ProductView.create("product"),
  cart: ShoppingCartView.create("shopping-cart"),
};

const Router = {
  view: null,
};

export const Routes = {
  home(products) {
    HomeView.update(products);
    UpdateView.toggle(Views.home);
  },
  product(product) {
    ProductView.update(product);
    UpdateView.toggle(Views.product);
  },
  cart(order) {
    ShoppingCartView.update(order);
    UpdateView.toggle(Views.cart);
  },
};

const UpdateView = {
  toggle([{ data: view }]) {
    if (view) {
      UIClasses.toggle(Router.view ?? view, ["is-hidden"]);
      Router.view = view;
    }
  },
};
