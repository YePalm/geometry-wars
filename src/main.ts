import Ship from "../modules/Ship";
import GreenSquare from "../modules/GreenSquare";
import PurpleSquare from "../modules/PurpleSquare";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let ship: Ship;
let greenSquares: GreenSquare[] = []
let purpleSquares: PurpleSquare[] = []

if (ctx) {
  ship = new Ship(ctx);
}

//squares
interface Squares {
  lastShotTime: number;
  greenShotCooldown: number;
  prupleShotCooldown: number;
  fillSquares(ctx: CanvasRenderingContext2D): void;
}

//green squares
const squares: Squares = {
  lastShotTime: 0,
  greenShotCooldown: 1000,
  prupleShotCooldown: 1000,
  fillSquares(ctx: CanvasRenderingContext2D) {
    const currentTime = performance.now();
    if (currentTime - this.lastShotTime < this.greenShotCooldown) {
      return
    }
    this.lastShotTime = currentTime;

    if (greenSquares.length < 8) { // filling green squares (8 default)
      let angles: number[] = [-135, -45, 45, 135]
      let randomX: number = Math.floor(Math.random() * 1200) + 100;
      let randomY: number = Math.floor(Math.random() * 700) + 100;
      let randomAngle: number = angles[Math.floor(Math.random() * angles.length)]
      greenSquares.push(new GreenSquare(ctx, randomX, randomY, randomAngle))
    }
    if (purpleSquares.length < 5) { // filling purple squares (5 default)
      let randomX: number = Math.floor(Math.random() * 1200) + 100;
      let randomY: number = Math.floor(Math.random() * 700) + 100;
      purpleSquares.push(new PurpleSquare(ctx, randomX, randomY))
    }
  }
}

function checkCollision() { // checking collisions
  const bullets = ship.getBullets()
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = greenSquares.length - 1; j >= 0; j--) {
      if (bullets[i].didHitSquare(greenSquares[j])) {
        ship.addPoints(20, bullets[i].x, bullets[i].y);
        bullets.splice(i, 1);
        greenSquares.splice(j, 1);
        break;
      }
    }
    for (let k = purpleSquares.length - 1; k >= 0; k--) {
      if (bullets[i] && bullets[i].didHitSquare(purpleSquares[k])) { // Sprawdzamy, czy bullets[i] istnieje
        ship.addPoints(40, bullets[i].x, bullets[i].y);
        bullets.splice(i, 1);
        purpleSquares.splice(k, 1);
        break;
      }
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //ship and bullets
  ship.drawShip();
  ship.update()
  ship.drawBullets()
  ship.drawPoints()

  //enemies (sqaures etc)
  squares.fillSquares(ctx)
  greenSquares.forEach(greenSquare => greenSquare.draw());
  greenSquares.forEach(greenSquare => greenSquare.update());

  purpleSquares.forEach(purpleSquare => purpleSquare.draw());
  purpleSquares.forEach(purpleSquare => purpleSquare.update(ship));

  //checking collision
  checkCollision()

  //frames
  requestAnimationFrame(gameLoop)
}

function init() {
  ship.setupControls()
  requestAnimationFrame(gameLoop)
}

init()


