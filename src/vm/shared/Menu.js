import assert from 'utils/assert';

import EventedViewModel from 'vm/utils/EventedViewModel';
import MenuItem from 'vm/shared/MenuItem';

/**
 * Menu view model
 */
export default class Menu extends EventedViewModel {

    static eventTypes = [
        'change',
        'itemSelected'
    ];

    /**
     * Menu items
     * @type {array.<MenuItem>}
     */
    items = [];

    /**
     * Constructor
     * @param {object}            [opts]
     * @param {array.<MenuItems>} [opts.items]
     */
    constructor({items = []} = {}) {
        super();

        assert(items.every(i => i instanceof MenuItem));
        this.items = items;
    }

    /**
     * Handles menu item selected event
     * @param {MenuItem} item
     */
    onItemSelected(item) {
        this.emit('itemSelected', item);
    }

}