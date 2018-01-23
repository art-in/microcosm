import initProps from "utils/init-props";

/**
 * Point (position) on 2D surface
 */
export default class Point {
  /**
   * X coordinate
   * @type {number|undefined}
   */
  x = undefined;

  /**
   * Y coordinate
   * @type {number|undefined}
   */
  y = undefined;

  /**
   * Constructor
   * @param {Partial<Point>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
