// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
	// check if we need to save what we already have in localStorage
	var currentStorage = localStorage.getItem(key);
	var newStorage;
	if (currentStorage === null) {
		// nothing in storage for this key, so just save as array of one
		newStorage = JSON.stringify([data]);
	} else {
		// we have stuff in storage for this key (as an array) so add to it
		var currentStorageArray = JSON.parse(currentStorage);
		currentStorageArray.push(data);
		newStorage = JSON.stringify(currentStorageArray);
	}
	localStorage.setItem(key, newStorage);
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get parameter from URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  position = "afterbegin",
  clear = true,
  callback
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = await templateFn();
  parentElement.insertAdjacentHTML(position, htmlString);

  if (callback) {
	callback(data);
  }
}

export function loadTemplate(path) {
	return async function () {
		const res = await fetch(path);
		if (res.ok) {
			const html = await res.text();
			return html;
		}
	};
}

export function loadHeaderFooter() {
	const headerTemplateFn = loadTemplate("/partials/header.html");
	const footerTemplateFn = loadTemplate("/partials/footer.html");
	const header = document.querySelector("#main-header");
	const footer = document.querySelector("#main-footer");
	renderWithTemplate(headerTemplateFn, header, null, 'afterbegin', true, loadSearch);
	renderWithTemplate(footerTemplateFn, footer);
}

export function newUserModal() {
  // Only show if user hasn't submitted email before
  if (!getLocalStorage("discountEmail")) {
    const modal = qs("#discountModal");
    if (!modal) return;

    // Unhide the modal
    modal.style.display = "block";

    // Close button logic
    setClick("#closeDiscount", () => {
      modal.style.display = "none";
    });

    // Submit logic
    setClick("#submitDiscount", () => {
      const email = qs("#userEmail").value;
      const isValid = /^\S+@\S+\.\S+$/.test(email);
      const message = qs("#discountMessage");

      if (isValid) {
        setLocalStorage("discountEmail", email);
        message.textContent = "Thanks! Discount applied!";
        setTimeout(() => {
          modal.style.display = "none";
        }, 1500);
      } else {
        message.textContent = "Please enter a valid email.";
      }
    });
  }
}

function loadSearch() {
	document.getElementById("header-search-icon").addEventListener("click", search);
}

async function search() {
	const search = document.getElementById("header-search-input").value;
	window.location = `/product_list/index.html?search=${search}`;
}

export function alertMessage(message, scroll=true) {
	const alertMessageHTML = document.createElement('div');
	alertMessageHTML.classList.add('alert');

	alertMessageHTML.innerHTML = `
		<p>${message}</p>
		<div class="space"></div>
		<button class="alert-btn">X</button>
	`

	alertMessageHTML.addEventListener('click', function(e) {
		if (e.target.classList.contains('alert-btn')) {
			main.removeChild(this);
		}
	})
	const main = document.querySelector('main');
	main.prepend(alertMessageHTML);
	
	if(scroll)
		window.scrollTo(0,0);
}

export function renderBreadcrumbs(category, search, productName, showCart = false) {
  const container = document.getElementById("breadcrumbs");
  if (!container) return;

  const crumbs = [`<a href="/index.html">Home</a>`];

  if (category === "cart") {
      crumbs.push(`<span> › </span><span><a href="/cart/index.html">Cart</a></span>`);
  } else if (category) {
    crumbs.push(`<span> › </span><a href="/product_list/index.html?category=${category}">${capitalize(category)}</a>`);
  } else if (search) {
    crumbs.push(`<span> › </span><a href="/product_list/index.html?search=${search}">Search: "${search}"</a>`);
  } 

  if (productName) {
    crumbs.push(`<span> › </span><span>${productName}</span>`);
  }

  if (showCart) {
    crumbs.push(`<span> › </span><a href="/cart/index.html">Cart</a>`);
  }

  container.innerHTML = crumbs.join("");
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

