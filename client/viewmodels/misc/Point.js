/**
 * Point (position) view model
 */
export default class Point {

    /**
     * constructor
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Stringifies instantce
     * @return {string}
     */
    toString() {
        return `[Point (${this.x} x ${this.y})]`;
    }

}