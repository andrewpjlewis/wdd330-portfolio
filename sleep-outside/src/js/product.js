import { getParam } from "./utils.mjs";
import productDetails from "./productDetails.mjs";
import { loadHeaderFooter, renderBreadcrumbs } from "./utils.mjs";

async function init() {
  const productId = getParam("product");
  const productData = await productDetails(productId);

  // Update cart counter on page load
  const items = JSON.parse(localStorage.getItem("so-cart")) || [];
  const counterEl = document.getElementById("cartCounter");
  if (counterEl) {
    counterEl.textContent = items.length > 0 ? items.length : "";
  }

  loadHeaderFooter();

  const category = productData?.Category || null;
  const productName = productData?.NameWithoutBrand || null;
  const search = getParam("search");

  renderBreadcrumbs(category, search, productName);
}

init();