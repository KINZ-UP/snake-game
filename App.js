export default class App {
  constructor(numUnit) {
    const gameContainer = document.getElementById("game-container");
    const oldCanvas = document.getElementById("canvas");
    gameContainer.removeChild(oldCanvas);

    const dashboard = document.getElementById("dashboard");
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.width = 600;
    canvas.height = 600;
    gameContainer.insertBefore(canvas, dashboard);

    this.ctx = canvas.getContext("2d");
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.snakeColor = "#fff";
    this.prayColor = "yellow";
    this.numUnit = numUnit || 15;
    this.unitSpacing = this.canvasWidth / this.numUnit;

    const initCoord = Math.floor(this.numUnit / 2);
    this.paddingRatio = 0.1;
    this.padding = this.unitSpacing * this.paddingRatio;
    this.unitSize = this.unitSpacing - this.padding * 2;

    this.headCoord = {
      x: initCoord,
      y: initCoord,
    };
    this.headPos = {
      x: this.headCoord.x * this.unitSpacing,
      y: this.headCoord.y * this.unitSpacing,
    };

    this.snake = [];
    this.snake.push({ ...this.headCoord });
    this.direct = "up";

    this.remain = this.numUnit ** 2 - 1;
    this.board = Array.from({ length: this.numUnit }, () =>
      Array(this.numUnit).fill(0)
    );

    this.board[this.headCoord.y][this.headCoord.x] = 1;

    this.initTime = 0;
    this.timeUnit = 1;
    this.timeSpacing = 500;

    this.success = false;
    this.failed = false;
    this.failureEffectIdx = 0;
    this.failureWindowSize = { width: 500, height: 300 };
    this.makeRandomPray();

    this.animation = window.setInterval(this.animate.bind(this), 500);
    document.body.addEventListener("keydown", this.pressKey.bind(this));

    this.scoreBox = document.getElementById("score-box");
    this.score = 0;
    this.scoreBox.innerText = +0;
    this.highScoreBox = document.getElementById("high-score-box");
    this.highScore = parseInt(this.highScoreBox.innerText) || 0;
  }

  update() {
    switch (this.direct) {
      case "up": {
        this.headCoord.y -= 1;
        break;
      }
      case "down": {
        this.headCoord.y += 1;
        break;
      }
      case "left": {
        this.headCoord.x -= 1;
        break;
      }
      case "right": {
        this.headCoord.x += 1;
        break;
      }
      default:
        break;
    }

    this.headPos = {
      x: this.headCoord.x * this.unitSpacing,
      y: this.headCoord.y * this.unitSpacing,
    };

    // failure condition
    if (
      this.headCoord.x < 0 ||
      this.headCoord.y < 0 ||
      this.headCoord.x === this.numUnit ||
      this.headCoord.y === this.numUnit ||
      this.board[this.headCoord.y][this.headCoord.x] === 1
    ) {
      this.failed = true;
      return;
    }

    // if not fail, update board
    this.board[this.headCoord.y][this.headCoord.x] = 1;

    // eating condition
    if (
      this.headCoord.x !== this.prayCoord.x ||
      this.headCoord.y !== this.prayCoord.y
    ) {
      const tailCoord = this.snake.pop();
      this.board[tailCoord.y][tailCoord.x] = 0;
    } else {
      this.score += 1;
      this.scoreBox.innerText = +this.score;
      this.remain -= 1;
      if (this.remain === 1) {
        this.success = true;
        return;
      }
      this.makeRandomPray();
    }
    this.snake.splice(0, 0, { ...this.headCoord });
  }

  // make random pray with avoiding snake's occupation
  makeRandomPray() {
    let randomIdx = getRandomInt(this.remain);
    for (let y = 0; y < this.numUnit; y++) {
      for (let x = 0; x < this.numUnit; x++) {
        if (this.board[y][x] === 1) continue;
        if (randomIdx === 0) {
          this.prayCoord = { x, y };
          this.prayPos = {
            x: this.prayCoord.x * this.unitSpacing,
            y: this.prayCoord.y * this.unitSpacing,
          };
          return;
        }
        randomIdx -= 1;
      }
    }
  }

  draw() {
    // pray;
    this.ctx.fillStyle = this.prayColor;
    this.ctx.fillRect(
      this.prayPos.x + this.padding,
      this.prayPos.y + this.padding,
      this.unitSize,
      this.unitSize
    );

    // snake;
    this.ctx.fillStyle = this.snakeColor;
    this.snake.forEach((s) => {
      this.ctx.fillRect(
        s.x * this.unitSpacing + this.padding,
        s.y * this.unitSpacing + this.padding,
        this.unitSize,
        this.unitSize
      );
    });
  }

  animate() {
    this.update();
    if (this.failed || this.success) {
      window.clearInterval(this.animation);
      this.endAnimation = window.setInterval(this.endAnimate.bind(this), 50);
      this.highScoreBox.innerText = +Math.max(this.highScore, this.score);
      return;
    }
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = this.snakeColor;
    this.draw();
  }

  endAnimate() {
    this.snake.forEach((s, idx) => {
      this.ctx.fillStyle = idx === this.failureEffectIdx ? "red" : "white";
      this.ctx.fillRect(
        s.x * this.unitSpacing + this.padding,
        s.y * this.unitSpacing + this.padding,
        this.unitSize,
        this.unitSize
      );
    });
    this.ctx.fillStyle = "rgba(200,200,255,0.7)";
    this.ctx.fillRect(
      (this.canvasWidth - this.failureWindowSize.width) / 2,
      (this.canvasHeight - this.failureWindowSize.height) / 2,
      this.failureWindowSize.width,
      this.failureWindowSize.height
    );
    this.ctx.strokeStyle = "rgba(100,100,255,0.8)";
    this.ctx.lineWidth = "10";
    this.ctx.strokeRect(
      (this.canvasWidth - this.failureWindowSize.width) / 2,
      (this.canvasHeight - this.failureWindowSize.height) / 2,
      this.failureWindowSize.width,
      this.failureWindowSize.height
    );
    this.ctx.fillStyle = "white";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.font = "bold 100px arial";
    this.ctx.fillText(
      this.failed ? "FAIL" : "SUCCESS",
      this.canvasWidth / 2,
      this.canvasHeight / 2
    );
    this.failureEffectIdx += 1;
    if (this.failureEffectIdx === this.snake.length) {
      window.clearInterval(this.endAnimation);
    }
  }

  pressKey({ code }) {
    switch (code) {
      case "ArrowUp": {
        if (this.direct === "up" || this.direct === "down") return;
        this.direct = "up";
        return;
      }
      case "ArrowDown": {
        if (this.direct === "up" || this.direct === "down") return;
        this.direct = "down";
        return;
      }
      case "ArrowLeft": {
        if (this.direct === "left" || this.direct === "right") return;
        this.direct = "left";
      }
      case "ArrowRight": {
        if (this.direct === "left" || this.direct === "right") return;
        this.direct = "right";
        return;
      }

      default:
        return;
    }
  }
}

function getRandomInt(num) {
  return Math.floor(Math.random() * num);
}
