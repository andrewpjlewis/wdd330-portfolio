import {
  productList,
  renderPageForCategory,
  setUpSort,
  attachQuickViewListeners,
  searchProductList,
} from "./productList.mjs";
import { loadHeaderFooter, getParam, renderBreadcrumbs } from "./utils.mjs";

loadHeaderFooter();
const category = getParam("category");

productList(category, ".product-list");
renderPageForCategory(category);
setUpSort();
attachQuickViewListeners();

const search = getParam("search");
renderBreadcrumbs(category, search);
if (category) {
  productList(category, ".product-list");
  renderPageForCategory(category, "Top Products: ");
} else if (search) {
  searchProductList(search, ".product-list");
  renderPageForCategory(search, "All Products Containing: ");
}
setUpSort();
