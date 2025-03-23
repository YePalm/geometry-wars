import Ship from "../modules/Ship";
import GreenSquare from "../modules/GreenSquare";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let ship: Ship;
let greenSquares: GreenSquare[] = []

if (ctx) {
  ship = new Ship(ctx);
}

//squares
interface Squares {
  lastShotTime: number;
  shotCooldown: number;
  fillSquares(ctx: CanvasRenderingContext2D): void;
}

//green squares
const squares: Squares = {
  lastShotTime: 0,
  shotCooldown: 400,
  fillSquares(ctx: CanvasRenderingContext2D) {
    const currentTime = performance.now();
    if (currentTime - this.lastShotTime < this.shotCooldown) {
      return
    }
    this.lastShotTime = currentTime;

    if (greenSquares.length < 10) { //10 domyslnie
      let angles: number[] = [-135, -45, 45, 135]
      let randomX: number = Math.floor(Math.random() * 1200) + 100;
      let randomY: number = Math.floor(Math.random() * 700) + 100;
      let randomAngle: number = angles[Math.floor(Math.random() * angles.length)]
      greenSquares.push(new GreenSquare(ctx, randomX, randomY, randomAngle))
    }
  }
}

function checkCollision() { // checking collisions
  const bullets = ship.getBullets()
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < greenSquares.length; j++) { // with green squares
      if (bullets[i].didHitSquare(greenSquares[j])) {
        ship.addPoints(20, bullets[i].x, bullets[i].y)
        bullets.splice(i, 1)
        greenSquares.splice(j, 1)
        break
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


