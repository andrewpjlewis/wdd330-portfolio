import { loadHeaderFooter, renderBreadcrumbs } from "./utils.mjs";
import { renderWishlist } from "./renderWishlist.js";

loadHeaderFooter();
renderBreadcrumbs("wishlist");
renderWishlist();
