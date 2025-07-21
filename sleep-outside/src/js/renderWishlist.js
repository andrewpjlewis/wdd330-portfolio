import { getLocalStorage } from "./utils.mjs";

function wishlistItemTemplate(item, index) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
    </a>
    <a href="#"><h2 class="card__name">${item.Name}</h2></a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button class="delete-btn" data-index="${index}" aria-label="Remove from wishlist">&times;</button>
  </li>`;
}

export function renderWishlist() {
  const wishlistItems = getLocalStorage("so-wishlist");
  const listElement = document.querySelector(".wishlist-list");
  const totalElement = document.querySelector(".wishlist-total");
  const emptyHtml = `<h3>Your wishlist is empty. Add some cozy gear!</h3>`;

  if (!wishlistItems || wishlistItems.length === 0) {
    listElement.innerHTML = emptyHtml;
    totalElement.textContent = ""; // hide total if empty
    return;
  }

  const htmlItems = wishlistItems.map((item, index) => wishlistItemTemplate(item, index));
  listElement.innerHTML = htmlItems.join("");

  // Calculate total price
  const totalPrice = wishlistItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;

  // Add event listeners to remove buttons
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      const updatedWishlist = wishlistItems.filter((_, i) => i !== index);
      localStorage.setItem("so-wishlist", JSON.stringify(updatedWishlist));
      renderWishlist(); // re-render
    });
  });
}