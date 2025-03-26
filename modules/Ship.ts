import objects from "../src/objects.json";
import Bullet from "./Bullet"

const scoreBoard = document.getElementById("scoreBoard") as HTMLElement;

interface ShipCoordinates {
    x0: number;
    y0: number;
    w: number;
    h: number;
}

class Ship {
    private shipCoordinates: ShipCoordinates;
    private image: HTMLImageElement;
    private x: number;
    private y: number;
    private speed: number = 9;
    private angle: number = 0;
    private bullets: Bullet[] = [];
    private lastShotTime: number = 0;
    private shotCooldown: number = 100;
    private trail: { x: number; y: number; alpha: number }[] = [];
    private trailMaxLength: number = 25;
    private scoredPoints: number = 0;
    private floatingPoints: { points: number, x: number, y: number }[] = [];

    constructor(private ctx: CanvasRenderingContext2D) {
        this.shipCoordinates = objects.ship;
        this.image = new Image();
        this.image.src = "./../src/img/spritesheet.png";
        this.x = ctx.canvas.width / 2;
        this.y = ctx.canvas.height / 2;
        this.image.onload = () => {
            this.drawShip();
        };
    }
    getBullets(): Bullet[] { // getting array of all bullets
        return this.bullets;
    }
    getCoordinates() { // getting ship coordinates
        return { x: this.x, y: this.y };
    }
    setupControls() {
        window.addEventListener("keydown", (e) => this.handleKey(e, true));
        window.addEventListener("keyup", (e) => this.handleKey(e, false));
        window.addEventListener("keydown", (e) => this.handleKey(e, true));
        window.addEventListener("keyup", (e) => this.handleKey(e, false));
    }
    private keys: { [key: string]: boolean } = {};
    handleKey(event: KeyboardEvent, isPressed: boolean) { // buttons handling
        this.keys[event.key] = isPressed;
    }
    update() { // updating ship position
        let speedAngle: number = 10
        this.shoot()
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.isOffScreen()) {
                this.bullets.splice(index, 1);
            }
        });
        // if (this.keys["w"] && this.keys["a"]) { // Lewo-góra (↖)
        //     if (this.y > 1 && this.x > 0) {
        //         this.y -= this.speed / Math.sqrt(2);
        //         this.x -= this.speed / Math.sqrt(2);
        //         this.angle = -45;
        //     }
        // }
        // else if (this.keys["w"] && this.keys["d"]) { // Prawo-góra (↗)
        //     if (this.y > 1 && this.x < 1450) {
        //         this.y -= this.speed / Math.sqrt(2);
        //         this.x += this.speed / Math.sqrt(2);
        //         this.angle = 45;
        //     }
        // }
        // else if (this.keys["s"] && this.keys["a"]) { // Lewo-dół (↙)
        //     if (this.y <= 743 && this.x > 0) {
        //         this.y += this.speed / Math.sqrt(2);
        //         this.x -= this.speed / Math.sqrt(2);
        //         this.angle = -135;
        //     }
        // }
        // else if (this.keys["s"] && this.keys["d"]) { // Prawo-dół (↘)
        //     if (this.y <= 743 && this.x < 1450) {
        //         this.y += this.speed / Math.sqrt(2);
        //         this.x += this.speed / Math.sqrt(2);
        //         this.angle = 135;
        //     }
        // }

        if (this.keys["w"] && this.keys["a"]) {
            if (this.y > 0 + this.shipCoordinates.w * 0.1 && this.x > 5 + this.shipCoordinates.w * 0.1) {
                this.y -= this.speed / Math.sqrt(2);
                this.x -= this.speed / Math.sqrt(2);
                if (this.angle > -45) this.angle -= speedAngle
                if (this.angle < -45) this.angle += speedAngle
            }
        }
        else if (this.keys["w"] && this.keys["d"]) {
            if (this.y > 0 + this.shipCoordinates.w * 0.1 && this.x < 1300 - this.shipCoordinates.w * 0.1) {
                this.y -= this.speed / Math.sqrt(2);
                this.x += this.speed / Math.sqrt(2);
                if (this.angle > 45) this.angle -= speedAngle
                if (this.angle < 45) this.angle += speedAngle
            }
        }
        else if (this.keys["s"] && this.keys["a"]) {
            if (this.y < 800 - this.shipCoordinates.w * 0.1 && this.x > 5 + this.shipCoordinates.w * 0.1) {
                this.y += this.speed / Math.sqrt(2);
                this.x -= this.speed / Math.sqrt(2);
                if (this.angle < 45 && this.angle > -135) this.angle -= speedAngle
                if (this.angle > 45) this.angle += speedAngle
                if (this.angle >= 180) this.angle = -179
                if (this.angle <= -180) this.angle = 179
                if (this.angle < -135 && this.angle > -180) this.angle += speedAngle
            }
        }
        else if (this.keys["s"] && this.keys["d"]) {
            if (this.y < 800 - this.shipCoordinates.w * 0.1 && this.x < 1300 - this.shipCoordinates.w * 0.1) {
                this.y += this.speed / Math.sqrt(2);
                this.x += this.speed / Math.sqrt(2);
                if (this.angle > -45 && this.angle < 135) this.angle += speedAngle
                if (this.angle < -45 && this.angle >= -180) {
                    if (this.angle == -180) this.angle = 179
                    this.angle -= speedAngle
                }
                if (this.angle < 180 && this.angle > 135) this.angle -= speedAngle
                if (this.angle == 180) this.angle = -179

            }
        }
        else {
            if (this.keys["w"]) {
                if (this.y > 0 + this.shipCoordinates.w * 0.1) {
                    this.y -= this.speed;
                    if (this.angle > 0 && this.angle < 180) {
                        this.angle -= speedAngle
                        if (this.angle < 0) this.angle = 0
                    }
                    if (this.angle < 0 && this.angle > -180) {
                        this.angle += speedAngle
                    }
                    if (this.angle == 180) this.angle -= speedAngle
                    if (this.angle == -180) this.angle += speedAngle
                    this.angle = Math.max(-180, Math.min(this.angle, 180));
                }
            }
            if (this.keys["s"]) {
                if (this.y < 800 - this.shipCoordinates.w * 0.1) {
                    this.y += this.speed;
                    if (this.angle > 0 && this.angle < 180) {
                        this.angle += speedAngle
                    }
                    if (this.angle < 0 && this.angle > -180) {
                        this.angle -= speedAngle
                    }
                    if (this.angle == 0) this.angle += speedAngle
                    this.angle = Math.max(-180, Math.min(this.angle, 180));
                }
            }
            if (this.keys["a"]) {
                if (this.x > 0 + this.shipCoordinates.w * 0.1) {
                    this.x -= this.speed;
                    if (this.angle < 90 && this.angle > -90) {
                        this.angle -= speedAngle
                    }
                    if (this.angle > 90) {
                        if (this.angle == 180) this.angle = -180
                        this.angle += speedAngle
                    }
                    if (this.angle < -90) {
                        this.angle += speedAngle
                    }
                    if (this.angle == 90) {
                        this.angle -= speedAngle
                    }
                    this.angle = Math.max(-180, Math.min(this.angle, 180));
                }
            }
            if (this.keys["d"]) {
                if (this.x < 1300 - this.shipCoordinates.w * 0.1) {
                    this.x += this.speed;
                    if (this.angle < 90 && this.angle > -90) {
                        this.angle += speedAngle
                    }
                    if (this.angle > 90) {
                        this.angle -= speedAngle
                    }
                    if (this.angle < -90) {
                        if (this.angle == -180) this.angle = 180
                        this.angle -= speedAngle
                    }
                    if (this.angle == -90) {
                        this.angle += speedAngle
                    }
                    this.angle = Math.max(-180, Math.min(this.angle, 180));
                }
            }
        }

        // drawing trail
        this.angle = Math.max(-180, Math.min(this.angle, 180));
        this.trail.push({ x: this.x, y: this.y, alpha: 1.5 });

        if (this.trail.length > this.trailMaxLength) {
            this.trail.shift();
        }
    }
    drawShip() { // drawing ship and trail
        this.drawTrail();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        this.ctx.rotate(this.angle * Math.PI / 180);

        this.ctx.drawImage(
            this.image,
            this.shipCoordinates.x0,
            this.shipCoordinates.y0,
            this.shipCoordinates.w,
            this.shipCoordinates.h,
            -this.shipCoordinates.w * 0.1,  // Środek statku na (0,0)
            -this.shipCoordinates.h * 0.1,
            this.shipCoordinates.w * 0.2,
            this.shipCoordinates.h * 0.2,
        );

        this.ctx.restore();
    }
    shoot() { // adding bullets to array of all bullets (ship shooting)
        const currentTime = performance.now();
        if (currentTime - this.lastShotTime < this.shotCooldown) {
            return
        }
        this.lastShotTime = currentTime;

        let bullet: Bullet
        if (this.keys["ArrowUp"] && this.keys["ArrowRight"]) {
            bullet = new Bullet(this.ctx, 45, this.x, this.y)
            this.bullets.push(bullet)
        } else if (this.keys["ArrowUp"] && this.keys["ArrowLeft"]) {
            bullet = new Bullet(this.ctx, -45, this.x, this.y)
            this.bullets.push(bullet)
        } else if (this.keys["ArrowDown"] && this.keys["ArrowRight"]) {
            bullet = new Bullet(this.ctx, 135, this.x, this.y)
            this.bullets.push(bullet)
        } else if (this.keys["ArrowDown"] && this.keys["ArrowLeft"]) {
            bullet = new Bullet(this.ctx, -135, this.x, this.y)
            this.bullets.push(bullet)
        } else {
            if (this.keys["ArrowUp"]) {
                bullet = new Bullet(this.ctx, 0, this.x, this.y)
                this.bullets.push(bullet)
            } else if (this.keys["ArrowDown"]) {
                bullet = new Bullet(this.ctx, 180, this.x, this.y)
                this.bullets.push(bullet)
            } else if (this.keys["ArrowRight"]) {
                bullet = new Bullet(this.ctx, 90, this.x, this.y)
                this.bullets.push(bullet)
            } else if (this.keys["ArrowLeft"]) {
                bullet = new Bullet(this.ctx, -90, this.x, this.y)
                this.bullets.push(bullet)
            }
        }
    }
    drawBullets() { // drawing bullets
        this.bullets.forEach(bullet => bullet.draw());
    }
    drawTrail() { //drawing tail
        for (let i = 0; i < this.trail.length; i++) {
            let { x, y, alpha } = this.trail[i];

            this.ctx.save();
            this.ctx.globalAlpha = alpha * 0.3;

            this.ctx.fillStyle = "rgba(0, 255, 255, 1)";
            this.ctx.beginPath();
            this.ctx.arc(x, y, 10, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();

            this.trail[i].alpha *= 0.9;
        }
    }
    addPoints(points: number, x: number, y: number) { // adding global and temporary points
        this.scoredPoints += points
        this.floatingPoints.push({ points, x, y })
        setTimeout(() => {
            this.floatingPoints.pop()
        }, 1000);
    }
    drawPoints() { //drawing global and temporary poinst
        scoreBoard.innerHTML = `Scored poinst: ${this.scoredPoints}`
        this.floatingPoints.forEach(point => {
            if (point.points == 20) {
                this.ctx.font = "50px Arial";
                this.ctx.strokeStyle = "yellow";
                this.ctx.strokeText(point.points.toString(), point.x, point.y);
            } else if (point.points == 40) {
                this.ctx.font = "50px Arial";
                this.ctx.strokeStyle = "cyan";
                this.ctx.strokeText(point.points.toString(), point.x, point.y);
            }
        });
    }
}

export default Ship;