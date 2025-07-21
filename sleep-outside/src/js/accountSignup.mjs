import { signup } from "./externalServices.mjs";
import { alertMessage } from "./utils.mjs";

export function prepareSignup() {
  const checkbox = document.getElementById("signupPasswordShow");
  checkbox.addEventListener("change", showPassword);

  document.querySelector(".checkoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  // sending passwords as plaintext woohoo!
  let userObj = {
    "email": e.target.signupEmail.value,
    "password": e.target.signupPassword.value
  };
  const res = await signup(userObj);
  alertMessage(res.message);
});
}

function showPassword() {
  const id = "signupPassword";
  var x = document.getElementById(id);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
} 