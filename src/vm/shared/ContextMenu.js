import ViewModel from 'vm/utils/ViewModel';

import Menu from './Menu';
import Popup from './Popup';

/**
 * Context menu
 */
export default class ContextMenu extends ViewModel {

    /**
     * Popup container
     */
    popup = undefined;

    /**
     * Menu
     */
    menu = undefined;

    /**
     * Is shown?
     * @type {bool}
     */
    get active() {
        return this.popup && this.popup.active;
    }

    /**
     * Constructor
     * @param {object}           [opts]
     * @param {array.<MenuItem>} [opts.items]
     */
    constructor({items = []} = {}) {
        super();
        
        this.popup = new Popup();
        this.menu = new Menu({items});
    }

}