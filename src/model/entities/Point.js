import initProps from 'utils/init-props';

/**
 * Point (position) on 2D surface
 */
export default class Point {
  /**
   * X coordinate
   * @type {number|undefined}
   */
  x;

  /**
   * Y coordinate
   * @type {number|undefined}
   */
  y;

  /**
   * Constructor
   * @param {Partial<Point>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }

  /**
   * Stringifies instance
   * @return {string}
   */
  toString() {
    return `[Point (${this.x}, ${this.y})]`;
  }
}
