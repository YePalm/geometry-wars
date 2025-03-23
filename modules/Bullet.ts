import objects from "../src/objects.json";
import GreenSquare from "./GreenSquare";

interface bulletCoordinates {
    x0: number;
    y0: number;
    w: number;
    h: number;
}

class Bulelt {
    private bulletCoordinates: bulletCoordinates;
    private image: HTMLImageElement;
    private speed: number = 13;

    constructor(private ctx: CanvasRenderingContext2D, private angle: number, public x: number, public y: number) {
        this.bulletCoordinates = objects.bullet;
        this.image = new Image();
        this.image.src = "./../src/img/spritesheet.png";
    }
    update() { //updating position
        this.x += this.speed * Math.sin(this.angle * Math.PI / 180);
        this.y -= this.speed * Math.cos(this.angle * Math.PI / 180);

    }
    draw() { //drawing bullet
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        this.ctx.rotate(this.angle * Math.PI / 180);

        this.ctx.drawImage(
            this.image,
            this.bulletCoordinates.x0,
            this.bulletCoordinates.y0,
            this.bulletCoordinates.w,
            this.bulletCoordinates.h,
            -this.bulletCoordinates.w * 0.05,  // Środek statku na (0,0)
            -this.bulletCoordinates.h * 0.05,
            this.bulletCoordinates.w * 0.1,
            this.bulletCoordinates.h * 0.1,
        );
        this.ctx.restore();
    }
    isOffScreen() { // checking if is of screen
        if (this.x < 0 || this.x > 1300 || this.y < 0 || this.y > 800) {
            return true
        } else {
            return false
        }
    }
    didHitSquare(square: GreenSquare) { // AABB collision
        return this.x < square.x + (square.GreenSquareCoordinates.w * 0.16) &&
            this.x + (this.bulletCoordinates.w * 0.05) > square.x &&
            this.y < square.y + (square.GreenSquareCoordinates.h * 0.16) &&
            this.y + (this.bulletCoordinates.h * 0.05) > square.y
    }
}

export default Bulelt