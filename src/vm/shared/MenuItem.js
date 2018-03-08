import initProps from 'utils/init-props';

import IconType from 'vm/shared/Icon';
import MenuItemType from 'vm/shared/MenuItemType';

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
   * @type {MenuItemType}
   */
  type = MenuItemType.action;

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
   * Gets action to dispatch after item selected
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
