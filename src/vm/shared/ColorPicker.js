import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

/**
 * Color picker
 */
export default class ColorPicker extends ViewModel {
  /**
   * Is picker shown?
   * @type {boolean}
   */
  active = false;

  /**
   * Initial color (set on activation)
   * @type {string}
   */
  initialColor;

  /**
   * Gets action after color selected
   * @type {function|undefined}
   */
  onSelectAction;

  /**
   * Constructor
   * @param {Partial<ColorPicker>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
