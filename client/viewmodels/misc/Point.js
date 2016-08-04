export default class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `[Point (${this.x} x ${this.y})]`;
    }

}