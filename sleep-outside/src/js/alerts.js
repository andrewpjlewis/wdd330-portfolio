import { getProductsByCategory } from "./externalServices.mjs";

async function createAlert() {
  const category = "alerts";
  const alertData = await getProductsByCategory(category);

  if (alertData) {
    const pageBody = document.querySelector("main");
    const alertModule = document.createElement("section");
    alertModule.className = "alert-list";

    alertData.forEach((data) => {
      const alert = document.createElement("p");
      alert.textContent = data.message;
      alert.style.background = data.background;
      alert.style.color = data.color;

      alertModule.append(alert);
    });

    pageBody.prepend(alertModule);
  }
}

createAlert();
