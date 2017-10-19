/**
 * Point (position) on 2D surface
 */
export default class Point {

    /**
     * X coordinate
     */
    x = undefined;

    /**
     * Y coordinate
     */
    y = undefined;

    /**
     * Constructor
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}