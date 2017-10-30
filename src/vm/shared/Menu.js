import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';

/**
 * Menu
 */
export default class Menu extends ViewModel {

    /**
     * Menu items
     * @type {array.<MenuItem>}
     */
    items = [];

    /**
     * Handles menu item selected event
     * @param {MenuItem} item
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
        initInstance(this, props);
    }
}