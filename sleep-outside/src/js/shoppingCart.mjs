import { getLocalStorage } from "./utils.mjs";

export function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  const emptyCartHtml = `<h3>Empty Cart. It is so sad and lonely here. Please buy a tent to make it warm and cozy.</h3>`;
  // use optional chaining to check if this bad boy is empty
  if (cartItems != null && cartItems?.length <= 0) {
    // items were deleted from cart
    document.querySelector(".product-list").innerHTML = emptyCartHtml;
  } else {
    //uses a map to aggrgate the duplicate values in the local storage
    const itemMap = {};
    cartItems?.forEach(item => {
      // Sets the key equal to the Id
      const key = item.Id;
      if (!itemMap[key]) {
        itemMap[key] = { item, quantity: 1 };
      } else {
        itemMap[key].quantity += 1;
      }
    });
  	// we either have a cart of items or we don't even have the cart in local storage
    const htmlItems = Object.values(itemMap).map(({ item, quantity }) => cartItemTemplate(item, quantity));
    document.querySelector(".product-list").innerHTML = htmlItems
      ? htmlItems.join("")
      : emptyCartHtml;
  }

  // Will hide the total if cart is empty
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".cart-total").style.display = "none";
    return;
  }

  // Will display cart total if there is at least one item in cart
  const cartTotal = document.querySelector(".cart-total");
  cartTotal.style.display = "block";

  const totalPrice = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  cartTotal.innerText = `Total: $${totalPrice.toFixed(2)}`;

  // Attach delete button listeners AFTER rendering
  document.querySelectorAll(".delete-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
      // Remove the item at this index
      const updatedCart = cartItems.filter((_, i) => i !== index);
      localStorage.setItem("so-cart", JSON.stringify(updatedCart));
      renderCartContents(); // re-render the updated cart
    });
  });
    document.querySelectorAll(".wishlist-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
      const itemToMove = cartItems[index];

      // Get current wishlist items or empty array
      const wishlist = JSON.parse(localStorage.getItem("so-wishlist")) || [];

      // Add to wishlist
      wishlist.push(itemToMove);
      localStorage.setItem("so-wishlist", JSON.stringify(wishlist));

      // Remove from cart
      const updatedCart = cartItems.filter((_, i) => i !== index);
      localStorage.setItem("so-cart", JSON.stringify(updatedCart));

      // Re-render the cart
      renderCartContents();
    });
  });
}

export function cartItemTemplate(item, quantity) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimarySmall}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="delete-btn" aria-label="Remove item">&times;</button>
  <button class="wishlist-btn" aria-label="Add to wishlist">Add To Wishlist</button>
</li>`;
  return newItem;
}