import objects from "../src/objects.json";

interface GreenSquareCoordinates {
    x0: number;
    y0: number;
    w: number;
    h: number;
}

interface Square {
    x: number;
    y: number;
    getWidth(): number;
    getHeight(): number;
}

class GreenSquare implements Square {
    public GreenSquareCoordinates: GreenSquareCoordinates;
    public x: number;
    public y: number;
    private image: HTMLImageElement;
    private speed: number = 4;

    constructor(private ctx: CanvasRenderingContext2D, x: number, y: number, private angle: number) {
        this.x = x
        this.y = y
        this.GreenSquareCoordinates = objects.greenSquare;
        this.image = new Image();
        this.image.src = "./../src/img/spritesheet.png";
    }
    getWidth() {
        return this.GreenSquareCoordinates.w * 0.16;
    }
    getHeight() {
        return this.GreenSquareCoordinates.h * 0.16;
    }
    update() { //updating position
        this.x += this.speed * Math.sin(this.angle * Math.PI / 180);
        this.y -= this.speed * Math.cos(this.angle * Math.PI / 180);
        this.isOffScreen()
    }
    draw() { //drawing bullet
        this.ctx.drawImage(
            this.image,
            this.GreenSquareCoordinates.x0,
            this.GreenSquareCoordinates.y0,
            this.GreenSquareCoordinates.w,
            this.GreenSquareCoordinates.h,
            this.x,
            this.y,
            this.GreenSquareCoordinates.w * 0.16,
            this.GreenSquareCoordinates.h * 0.16,
        );
    }
    isOffScreen() { // checking if is of screen
        if (this.x < 0) {
            if (this.angle == -45) this.angle = 45
            if (this.angle == -135) this.angle = 135
        } else if (this.x > 1300 - this.GreenSquareCoordinates.w * 0.16) {
            if (this.angle == 45) this.angle = -45
            if (this.angle == 135) this.angle = -135
        } else if (this.y < 0) {
            if (this.angle == 45) this.angle = 135
            if (this.angle == -45) this.angle = -135
        } else if (this.y > 800 - this.GreenSquareCoordinates.h * 0.16) {
            if (this.angle == 135) this.angle = 45
            if (this.angle == -135) this.angle = -45
        }
    }
}

export default GreenSquare