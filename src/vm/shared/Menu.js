import initProps from "utils/init-props";

import ViewModel from "vm/utils/ViewModel";
import MenuItemType from "./MenuItem";

/**
 * Menu
 */
export default class Menu extends ViewModel {
  /**
   * Menu items
   * @type {Array.<MenuItemType>}
   */
  items = [];

  /**
   * Constructor
   * @param {Partial<Menu>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
