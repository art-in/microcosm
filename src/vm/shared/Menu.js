import EventedViewModel from 'vm/utils/EventedViewModel';

/**
 * Menu view model
 */
export default class Menu extends EventedViewModel {

    static eventTypes = [

        // state changed
        'change',
        
        // menu item triggered
        'itemSelected'
    ];

    /**
     * Menu items
     * @type {array.<MenuItem>}
     */
    items = [];

    /**
     * constructor
     * @param {array.<MenuItems>} items
     */
    constructor(items) {
        super();

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