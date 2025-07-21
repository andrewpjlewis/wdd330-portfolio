import { renderCartContents } from "./shoppingCart.mjs";
import { loadHeaderFooter, renderBreadcrumbs } from "./utils.mjs";

loadHeaderFooter();
renderBreadcrumbs("cart");
renderCartContents();