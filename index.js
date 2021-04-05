import App from "./App.js";
import Dashboard from "./Dashboard.js";

window.onload = () => {
  const app = new App();
  new Dashboard(app);
};
