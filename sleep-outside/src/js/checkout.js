import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter();

checkoutProcess.init("so-cart", ".checkout-summary");

document
  .querySelector("#zip")
  .addEventListener(
    "blur",
    checkoutProcess.calculateOrdertotal.bind(checkoutProcess),
  );

// this is how it would look if we listen for the submit on the form
document.querySelector(".checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  // e.target would contain our form in this case
  checkoutProcess.checkout(e.target);
});
