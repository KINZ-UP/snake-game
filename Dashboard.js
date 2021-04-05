import App from "./App.js";

export default class Dashboard {
  constructor(app) {
    this.selector = document.getElementById("number-selector");

    Array.from({ length: 8 }, (v, i) => (i + 1) * 5).forEach((num, idx) => {
      this.selector.options[idx] = new Option(+num, num);
    });

    this.selector.selectedIndex = 2;
    this.selector.addEventListener("change", () => {
      this.numUnit = this.selector.options[this.selector.selectedIndex].value;
      this.selector.blur();
    });

    this.restartBtn = document.getElementById("restart-btn");
    this.restartBtn.addEventListener("click", () => {
      new App(this.numUnit);
    });
  }
}
