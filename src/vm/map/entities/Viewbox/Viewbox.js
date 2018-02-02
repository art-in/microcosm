import Point from 'model/entities/Point';

/**
 * Logical rectangular fragment of canvas mapped to viewport.
 * Its size and position regulated with zooming and panning.
 * Its aspect ratio equals to aspect ratio of viewport.
 *
 * Q: top-left position and size are computed from center position and scale,
 *    why do we need those duplicates (since it raises code complexity)?
 * A: view really needs top-left position and size, but in code it is more
 *    appropriate to operate with center position and scale.
 *    eg. when zooming it is more appropriate to increment single scale number,
 *    instead of calculating scale in place by comparing viewport and viewbox
 *    sizes, and then incrementing scale.
 *    another example is positioning: usually we want to control the center of
 *    viewbox, not its top-left corner. eg. when opening mindmap we want to put
 *    focus idea into the center.
 */
export default class Viewbox {
  /**
   * Canvas position of viewbox center
   * @type {Point}
   */
  center = new Point();

  /**
   * Scale
   */
  scale = 1;
  scaleMin = 0.2;
  scaleMax = Infinity;

  /**
   * Canvas position of viewbox top-left corner
   * NOTE: computed from viewport size, scale and center pos.
   *       should not be updated alone without depencencies.
   *       use 'compute-viewbox-position-and-size' method to keep it in sync.
   * @type {Point}
   */
  topLeft = new Point();

  /**
   * Size
   * NOTE: computed from viewport size and scale.
   *       should not be updated alone without depencencies.
   *       use 'compute-viewbox-position-and-size' method to keep it in sync.
   * @type {{width: number, height: number}}
   */
  size = {
    width: undefined,
    height: undefined
  };
}
