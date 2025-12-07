import { UIClasses, UIElements } from "./utils";
import { HomeView, ProductView, ShoppingCartView } from "./views";

const ViewIdentifiers = {
  HOME: "home",
  PRODUCT: "product",
  SHOPPING_CART: "shopping-cart",
};

const Router = {
  view: null,
};

export const Routes = {
  home(products) {
    HomeView.update(products);
    UpdateView.toggle(ViewIdentifiers.HOME);
  },
  product(product) {
    ProductView.update(product);
    UpdateView.toggle(ViewIdentifiers.PRODUCT);
  },
  cart(order) {
    ShoppingCartView.update(order);
    UpdateView.toggle(ViewIdentifiers.SHOPPING_CART);
  },
};

const UpdateView = {
  toggle(id) {
    UIElements.getByIds([id], ([view]) => {
      UIClasses.toggle(Router.view ?? view, ["is-hidden"]);
      Router.view = view;
    });
  },
};
