import App from "./App.js";

export default class Dashboard {
  constructor(app) {
    this.app = app;
    this.selector = document.getElementById("number-selector");

    Array.from({ length: 6 }, (v, i) => (i + 1) * 5).forEach((num, idx) => {
      this.selector.options[idx] = new Option(+num, num);
    });

    this.selector.selectedIndex = 2;
    this.selector.addEventListener("change", () => {
      this.numUnit = this.selector.options[this.selector.selectedIndex].value;
      this.selector.blur();
    });

    this.restartBtn = document.getElementById("restart-btn");
    this.restartBtn.addEventListener("click", () => {
      this.app = new App(this.numUnit);
    });

    this.leftBtn = document.querySelector(".left-key");
    this.leftBtn.addEventListener("click", () =>
      this.app.pressKey({ code: "ArrowLeft" })
    );
    this.rightBtn = document.querySelector(".right-key");
    this.rightBtn.addEventListener("click", () =>
      this.app.pressKey({ code: "ArrowRight" })
    );
    this.spaceBtn = document.querySelector(".space-key");
    this.spaceBtn.addEventListener("click", () =>
      this.app.pressKey({ code: "Space" })
    );
  }
}
