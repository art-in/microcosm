import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';
import MenuType from 'vm/shared/Menu';

/**
 * Dropdown menu
 */
export default class DropDownMenu extends ViewModel {
  /**
   * Indicates that menu is shown
   * @type {boolean}
   */
  isActive = false;

  /**
   * Menu
   * @type {MenuType}
   */
  menu = undefined;

  /**
   * Constructor
   * @param {Partial<DropDownMenu>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
