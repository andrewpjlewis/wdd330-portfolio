import { checkout } from "./externalServices.mjs";
import { getLocalStorage, alertMessage } from "./utils.mjs";

const checkoutProcess = {
    key: "",
    outputSelector: "",
    list: [],
    itemTotal: 0,
    shipping: 0,
    tax: 0,
    orderTotal: 0,
    init: function (key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = getLocalStorage(key);
        this.calculateItemSummary();
    },
  calculateItemSummary: function() {
    // calculate and display the total amount of the items in the cart, and the number of items.
    this.numberOfItems = this.list.length
    const itemLabel = document.querySelector("#items")
    itemLabel.textContent = `Item Subtotal(${this.numberOfItems})`
    const totalPrice = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    this.itemTotal = `${totalPrice.toFixed(2)}`;
  },
  calculateOrdertotal: function() {
    // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
    this.tax = (this.itemTotal * 0.06).toFixed(2)
    this.shipping = 10 + ((this.list.length - 1) * 2)
    this.orderTotal = (parseFloat(this.itemTotal) + parseFloat(this.tax) + parseFloat(this.shipping)).toFixed(2)
    // display the totals.
    this.displayOrderTotals();
  },
  displayOrderTotals: function() {
    // once the totals are all calculated display them in the order summary page
    const form = document.querySelector(".checkoutForm")
    const numberOfItems = document.querySelector("#items")
    numberOfItems.textContent = `Item Subtotal(${this.numberOfItems})`
    form.subtotal.value = this.itemTotal
    form.shipping.value = this.shipping
    form.tax.value = this.tax
    form.orderTotal.value = this.orderTotal
  },
  checkout: async function(form) {
    try {
      const json = formDataToJSON(form);
      // build the data object from the calculated fields, the items in the cart, and the information entered into the form
      const finalItems = packageItems(this.list)
      const orderDate = new Date().toJSON();
      const finalObj = {
          orderDate: orderDate,
          fname: json.fname,
          lname: json.lname,
          street: json.street,
          city: json.city,
          state: json.state,
          zip: json.zip,
          cardNumber: json.cardNumber,
          expiration: json.expiration,
          code: json.code,
          items: finalItems,
          orderTotal: json.orderTotal,
          shipping: json.shipping,
          tax: json.tax
      }
      // call the checkout method in our externalServices module and send it our data object.
      const res = await checkout(finalObj)
      console.log(res)
      window.location.href = '../checkout/success.html'
      localStorage.clear();
    } catch (err) {
      const error = await err.message;
      for (let key in error) {
        alertMessage(error[key]);
      }
      console.log(err.message);
    }
  }
}

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
    const itemMap = {};
    items.forEach(item => {
        const key = item.Id;
        if (!itemMap[key]) {
            itemMap[key] = { item, quantity: 1 };
        } else {
            itemMap[key].quantity += 1;
        }
    });
    // convert the list of products from localStorage to the simpler form required for the checkout process. Array.map would be perfect for this.
    let packagedItems = items.map(item => {
        const itemId = item.Id
        const obj = {
            "id": item.Id,
            "name": item.Name,
            "price": item.FinalPrice,
            "quantity": itemMap[itemId].quantity,
        }
        return obj
    });
    // for items w/ quantity > 1, we will have that many copies in the array
    // who knows if that's okay
    return packagedItems;
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default checkoutProcess;