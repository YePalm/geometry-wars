import objects from "../src/objects.json";
import Ship from "../modules/Ship";

interface PurpleSquareCoordinates {
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

class PurpleSquare implements Square {
    public PurpleSquareCoordinates: PurpleSquareCoordinates;
    public x: number;
    public y: number;
    private image: HTMLImageElement;
    private speed: number = 4;
    private shipX: number = 0
    private shipY: number = 0

    constructor(private ctx: CanvasRenderingContext2D, x: number, y: number) {
        this.x = x
        this.y = y
        this.PurpleSquareCoordinates = objects.purpleSquare;
        this.image = new Image();
        this.image.src = "./../src/img/spritesheet.png";
    }
    getWidth() {
        return this.PurpleSquareCoordinates.w * 0.16;
    }
    getHeight() {
        return this.PurpleSquareCoordinates.h * 0.16;
    }
    update(ship: Ship) { //updating position
        this.shipX = ship.getCoordinates().x
        this.shipY = ship.getCoordinates().y

        let vecotor = this.countVector()
        this.x += vecotor.dx * this.speed;
        this.y += vecotor.dy * this.speed;
    }
    draw() { //drawing bullet
        this.ctx.drawImage(
            this.image,
            this.PurpleSquareCoordinates.x0,
            this.PurpleSquareCoordinates.y0,
            this.PurpleSquareCoordinates.w,
            this.PurpleSquareCoordinates.h,
            this.x,
            this.y,
            this.PurpleSquareCoordinates.w * 0.16,
            this.PurpleSquareCoordinates.h * 0.16,
        );
    }
    countVector() { // counting vetor to ship (returns vector from 0 to 1)
        let dx = this.shipX - this.x;
        let dy = this.shipY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return { dx: dx / distance, dy: dy / distance }
    }

}

export default PurpleSquare