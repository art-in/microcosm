import EventedViewModel from 'vm/utils/EventedViewModel';

import Menu from './Menu';
import Popup from './Popup';

/**
 * Context menu view model
 */
export default class ContextMenu extends EventedViewModel {

    static eventTypes = [
        
        // state changed
        'change',
        
        // menu item triggered
        'itemSelected'
    ];

    /**
     * Is shown?
     * @type {bool}
     */
    get active() {
        return this.popup && this.popup.active;
    }

    /**
     * Popup container
     */
    popup = undefined;

    /**
     * Menu
     */
    menu = undefined;

    /**
     * Target entity to show options for
     * @type {*}
     */
    target = null;

    /**
     * Constructor
     * @param {array.<MenuItem>} items 
     */
    constructor(items) {
        super();
        this.popup = new Popup();
        this.menu = new Menu(items);

        this.menu.on('itemSelected',
            (...data) => this.emit('itemSelected', ...data));
    }

    /**
     * Activates menu
     * @param {object} opts
     */
    activate({pos, target}) {
        this.target = target;
        this.popup.activate(pos);
    }

    /**
     * Deactivates menu
     * @param {object} opts
     */
    deactivate() {
        this.popup.deactivate();
    }

}