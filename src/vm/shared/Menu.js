import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';
import MenuItemType from './MenuItem';

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
     * Handles menu item selected event
     * @param {MenuItemType} item
     */
    onItemSelected(item) {
        this.emit('itemSelected', item);
    }

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        super();
        return initInstance(this, props);
    }
}