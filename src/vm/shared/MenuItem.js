import initProps from "utils/init-props";

import IconType from "vm/shared/Icon";

/**
 * Menu item
 */
export default class MenuItem {
  /**
   * Menu item ID
   * @type {string}
   */
  id = Math.random().toString();

  /**
   * Display value
   * @type {string|undefined}
   */
  displayValue = undefined;

  /**
   * Icon
   * @type {IconType|undefined}
   */
  icon = undefined;

  /**
   * Indicates item is ready to be selected
   * @type {boolean}
   */
  enabled = true;

  /**
   * Gets action after item selected
   * @type {function|undefined}
   */
  onSelectAction = undefined;

  /**
   * Constructor
   * @param {Partial<MenuItem>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
