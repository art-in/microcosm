import PointType from 'model/entities/Point';
import PointerButtonType from 'vm/utils/PointerButton';

/**
 * Represents instance of pointing device.
 *
 * Example:
 * - mouse cursor
 * - touch contact (eg. when finger or pen touches digitizer)
 */
export default class Pointer {
  /**
   * Pointer ID
   * @type {number}
   */
  id = undefined;

  /**
   * Position relative to viewport.
   * @type {PointType}
   */
  pos = undefined;

  /**
   * Pressed buttons
   * @type {Array.<PointerButtonType>}
   */
  pressedButtons = undefined;
}
