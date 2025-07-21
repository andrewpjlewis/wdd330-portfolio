import { setLocalStorage, alertMessage } from "./utils.mjs";
import { findProductById } from "./externalServices.mjs";
import { attachQuickViewListeners } from "./productList.mjs";

export default async function productDetails(productId) {
  addToCart();
  const productData = await findProductById(productId);
  renderProductDetails(productData);
  return productData;
}

function addToCart() {
  function addProductToCart(product) {
    setLocalStorage("so-cart", product);
  }

  async function addToCartHandler(e) {
    const product = await findProductById(e.target.dataset.id);
    addProductToCart(product);

    const cartIcon = document.querySelector(".cart");
    cartIcon.classList.add("animate");
    cartIcon.addEventListener(
      "animationend",
      () => {
        cartIcon.classList.remove("animate");
      },
      { once: true },
    );

    const items = JSON.parse(localStorage.getItem("so-cart")) || [];
    const counterEl = document.getElementById("cartCounter");
    // counterEl.textContent = items.length > 0 ? items.length : "";
    const productMessage = product.NameWithoutBrand + " was added to the cart.";
    alertMessage(productMessage);
  }

  document
    .getElementById("addToCart")
    .addEventListener("click", addToCartHandler);
}

export function renderProductDetails(productData) {
	if (productData === undefined) {
		document.getElementsByClassName("product-detail")[0].style.display = "none";


    const h1 = document.createElement("h1");
    const node = document.createTextNode("Product Not Currently Available");
    h1.appendChild(node);
    document.getElementsByTagName("main")[0].appendChild(h1);
    return;
  }

  // Get elements from HTML
  const productName = document.getElementById("productName");
  const productNameWithoutBrand = document.getElementById(
    "productNameWithoutBrand",
  );
  const productImage = document.getElementById("productImage");
  const productFinalPrice = document.getElementById("productFinalPrice");
  const productColorName = document.getElementById("productColorName");
  const productDescriptionHtmlSimple = document.getElementById(
    "productDescriptionHtmlSimple",
  );
  const cartBtn = document.getElementById("addToCart");
  const colorSwatchesContainer = document.getElementById("colorSwatches");

  // Set product info
  productName.textContent = productData.Brand.Name;
  productNameWithoutBrand.textContent = productData.NameWithoutBrand;

  // Create image carousel
  const imgContainer = document.getElementById("carousel-container");

  // Get images
  const images = [];

  images.push(productData.Images.PrimaryLarge);

  productData.Images.ExtraImages.forEach((image) => {
    images.push(image.Src);
  });

  for (let i = 0; i < images.length; i++) {
    const imgSlides = document.createElement("div");
    imgSlides.classList.add("imgSlides");
    const img = document.createElement("img");
    img.src = images[i];
    imgSlides.appendChild(img);
    imgContainer.appendChild(imgSlides);
  }

  const imgRow = document.createElement("div");
  imgRow.classList.add("row");

  for (let i = 0; i < images.length; i++) {
    const imgColumn = document.createElement("div");
    imgColumn.classList.add("column");
    const img = document.createElement("img");
    img.classList.add("img-thumb");
    img.src = images[i];

    img.addEventListener("click", () => {
      currentSlide(i + 1);
    });

    imgColumn.appendChild(img);
    imgRow.appendChild(imgColumn);
  }

  imgContainer.appendChild(imgRow);

  // Buttons
  const prev = document.createElement("a");
  prev.classList.add("prev");
  prev.textContent = "⟪";
  imgContainer.appendChild(prev);
  prev.addEventListener("click", () => {
    changeSlides(-1);
  });
  const next = document.createElement("a");
  next.classList.add("next");
  next.textContent = "⟫";
  imgContainer.appendChild(next);
  next.addEventListener("click", () => {
    changeSlides(1);
  });

  // Handle slide changes
  let slideIndex = 1;
  showSlides(slideIndex);

  function changeSlides(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("imgSlides");
    let thumbnail = document.getElementsByClassName("img-thumb");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < thumbnail.length; i++) {
      thumbnail[i].className = thumbnail[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    thumbnail[slideIndex - 1].className += " active";
  }

  // Initialize to first color
  const firstColor = productData.Colors[0];
  imgContainer.src =
    productData.Images.PrimaryExtraLarge || productData.Images.PrimaryLarge;
  imgContainer.alt =
    "Image of " + productData.Name + " in " + firstColor.ColorName;
  productFinalPrice.innerHTML = getDiscountPriceHtml(
    productData.SuggestedRetailPrice,
    productData.FinalPrice,
  );
  productColorName.textContent = firstColor.ColorName;
  productDescriptionHtmlSimple.innerHTML = productData.DescriptionHtmlSimple;
  cartBtn.setAttribute("data-id", productData.Id);

  // Clear previous swatches
  colorSwatchesContainer.innerHTML = "";

  // Create color swatches
  productData.Colors.forEach((color) => {
    const swatch = document.createElement("img");
    swatch.src = color.ColorChipImageSrc;
    swatch.alt = color.ColorName;
    swatch.title = color.ColorName;
    swatch.style.cursor = "pointer";
    swatch.style.width = "40px";
    swatch.style.height = "40px";
    swatch.style.marginRight = "8px";
    swatch.style.border =
      color.ColorCode === firstColor.ColorCode
        ? "2px solid blue"
        : "1px solid #ccc";

    swatch.addEventListener("click", () => {
      // Update main product image and color name when a swatch is clicked
      productImage.src =
        color.ColorPreviewImageSrc || productData.Images.PrimaryLarge;
      productImage.alt =
        "Image of " + productData.Name + " in " + color.ColorName;
      productColorName.textContent = color.ColorName;

      // Highlight selected swatch
      Array.from(colorSwatchesContainer.children).forEach((child) => {
        child.style.border = "1px solid #ccc";
      });
      swatch.style.border = "2px solid blue";
    });

    colorSwatchesContainer.appendChild(swatch);
  });
}

function getDiscountPriceHtml(originalPrice, discountPrice) {
  const discountPercent = Math.round((1 - discountPrice / originalPrice) * 100);

  let html = "";
  html += `<span class="original-price">$${originalPrice}</span>`;
  html += " $" + discountPrice;
  html += ` <span class="discount-badge">${discountPercent}% OFF</span>`;

  return html;
}
