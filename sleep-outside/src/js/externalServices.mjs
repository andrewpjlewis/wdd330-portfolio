const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  const jsonResponse = res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'serviceError', message: jsonResponse };
  }
}

export async function getProductsByCategory (category) {
  const response = await fetch(baseURL + `products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
}

export async function findProductById(id) {
  const response = await fetch(baseURL + `product/${id}`);
  const data = await convertToJson(response);
  return data.Result;
}

export async function checkout(orderObj){
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderObj)
  }

  return await fetch(baseURL + "checkout/", options).then(convertToJson)
}

export async function signup(userObj) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userObj)
  };
  return await fetch(baseURL + "users", options).then(convertToJson);
}
