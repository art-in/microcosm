import ViewModel from 'vm/utils/ViewModel';
import MenuItemType from 'vm/shared/MenuItem';

import Menu from './Menu';
import Popup from './Popup';

/**
 * Context menu
 */
export default class ContextMenu extends ViewModel {
  /**
   * Popup container
   * @type {Popup|undefined}
   */
  popup;

  /**
   * Menu
   * @type {Menu|undefined}
   */
  menu;

  /**
   * Is shown?
   * @type {boolean}
   */
  get active() {
    return this.popup && this.popup.active;
  }

  /**
   * Constructor
   * @param {object}           [opts]
   * @param {Array.<MenuItemType>} [opts.items]
   */
  constructor(opts = {}) {
    super();

    const {items = []} = opts;

    this.popup = new Popup();
    this.menu = new Menu({items});
  }
}
