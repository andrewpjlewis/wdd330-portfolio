import { getProductsByCategory, findProductById} from "./externalServices.mjs";
import {getParam} from "./utils.mjs";

export async function productList(category, htmlElement){
  const product = await getProductsByCategory(category);
  renderProductList(product, htmlElement);
}

function renderProductList(products, htmlElement) {
  products.forEach((data) => {
    const template = productCardTemplate(data);
    const element = document.querySelector(htmlElement);
    const li = document.createElement("li");
    li.innerHTML = template;
    element.append(li);
  });
}

function productCardTemplate(product){
    return `<li class="product-card">
            <a href="../product_pages/index.html?product=${product.Id}">
              <img
                src="${product.Images.PrimaryMedium}"
                alt="Image of ${product.Name}"
              />
              <h3 class="card__brand">${product.Brand.Name}</h3>
              <h2 class="card__name">${product.NameWithoutBrand}</h2>
              <p class="product-card__price">${product.FinalPrice}</p></a>
              <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
            </li>`;
}

export function renderPageForCategory(category, text) {
  const h2_title = document.getElementById("product_title");
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  h2_title.textContent = `${text} ${capitalizedCategory}`;
  document.title = `Sleep Outside | ${text} ${capitalizedCategory}`;
}

export function setUpSort() {
  async function sortHandler(e) {
    sortProducts(e.target.value);
  }
  document.getElementById("product_sort").addEventListener("change", sortHandler);
}

async function sortProducts(order) {
  // start by getting the data
  const category = getParam("category");
  const search = getParam("search");
  let product = [];
  if (category) {
    product = await getProductsByCategory(category);
  } else if (search) {
    product = await searchAllProducts(search);
  }

  // sort options match with values in product_list/index.html #product_sort
  switch (order) {
    case "name_asc": // name a - z
      product.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
      break;
    case "name_desc":
      product.sort((a, b) => b.NameWithoutBrand.localeCompare(a.NameWithoutBrand));
      break;
    case "price_asc": // price low to high
      product.sort((a, b) => a.FinalPrice - b.FinalPrice);
      break;
    case "price_desc":
      product.sort((a, b) => b.FinalPrice - a.FinalPrice);
      break;
    default:
      break;
  }

  // wipe the grid of products
  const element = document.querySelector(".product-list");
  element.innerHTML = "";

  // rebuild the display

  product.forEach(data => {
    const template = productCardTemplate(data);
    const li = document.createElement("li");
    li.innerHTML = template
    element.append(li);
  });
  attachQuickViewListeners();

  renderProductList(product, ".product-list");
}

export async function searchProductList(search, htmlElement) {
  const foundProducts = await searchAllProducts(search);
  renderProductList(foundProducts, htmlElement);
}

async function searchAllProducts(search) {
  const allCategories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
  let foundProducts = [];
  for await (const category of allCategories) {
    // get all products for this category
    const products = await getProductsByCategory(category);
    products.forEach((product) => {
      // only keep the products that match the search term
      // for now it's just in the name (with brand)
      if (product.Name.toLowerCase().includes(search.toLowerCase())) {
        foundProducts.push(product);
      }
    });
  }
  return foundProducts;

}

// Optional function: renderList - move adding to the document to its own funciton


// Quick View for each product. This will bring up a modal with the deatils of just one item.
export function attachQuickViewListeners() {
  const modal = document.createElement('div');
  modal.id = 'quickViewModal';
  modal.classList.add('modal');
  modal.classList.add('hidden');

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="quickViewCloseBtn">&times;</span>
      <div class="modal-product-details">
        <img id="modal-image" src="" alt="" />
        <div class="modal-info">
          <h3 id="modal-brand"></h3>
          <h2 id="modal-name"></h2>
          <p id="modal-price">$</p>
          <p><strong>Color:</strong> <span id="modal-color"></span></p>
          <div id="modal-description"></div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#quickViewCloseBtn').addEventListener('click', closeQuickView);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
    }
  });
  document.querySelectorAll('.quick-view-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const id = button.dataset.id;
      await openQuickView(id);
    });
  });
}

async function openQuickView(productId) {
  const product = await findProductById(productId);
  if (!product) return;

  document.getElementById('modal-image').src = product.Images.PrimaryLarge;
  document.getElementById('modal-image').alt = `Image of ${product.Name}`;
  document.getElementById('modal-brand').textContent = product.Brand.Name;
  document.getElementById('modal-name').textContent = product.NameWithoutBrand;
  document.getElementById('modal-color').innerHTML = product.Colors[0].ColorName;
  document.getElementById('modal-description').innerHTML = product.DescriptionHtmlSimple;
  document.getElementById('modal-price').textContent = `$${product.FinalPrice}`
  
  document.getElementById('quickViewModal').classList.remove('hidden');
}

function closeQuickView() {
  document.getElementById('quickViewModal').classList.add('hidden');
}