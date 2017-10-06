import EventedViewModel from 'vm/utils/EventedViewModel';

import Menu from './Menu';
import Popup from './Popup';

/**
 * Context menu view model
 * Menu shown inside free-flow popup
 */
export default class ContextMenu extends EventedViewModel {

    static eventTypes = [
        'change',
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
     * Constructor
     * @param {object}           [opts]
     * @param {array.<MenuItem>} [opts.items]
     */
    constructor({items = []} = {}) {
        super();
        this.popup = new Popup();
        this.menu = new Menu({items});

        this.retransmit(this.menu, 'itemSelected');
    }

    /**
     * Sets menu items
     * @param {array.<MenuItem>} items
     */
    setItems(items) {
        this.menu.setItems(items);
    }

    /**
     * Activates menu
     * @param {object} opts
     * @param {Point}  opts.pos
     */
    activate({pos}) {
        this.popup.activate({pos});
    }

    /**
     * Deactivates menu
     */
    deactivate() {
        this.popup.deactivate();
    }

}