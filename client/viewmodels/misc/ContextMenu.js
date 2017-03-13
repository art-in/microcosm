import Menu from './Menu';

/**
 * Context menu view model
 */
export default class ContextMenu extends Menu {

    /**
     * Is menu shown/focused?
     */
    active = false;

    /**
     * Position on canvas
     * @type {Point}
     */
    pos = null;

    /**
     * Target entity to show options to
     * @type {*}
     */
    target = null;

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[ContextMenu (items: ${this.items.length})]`;
    }

    /**
     * Activates menu
     * @param {object} opts
     */
    activate({pos, target}) {
        this.active = true;
        this.pos = pos;
        this.target = target;
        this.emit('change');
    }

    /**
     * Deactivates menu
     */
    deactivate() {
        this.active = false;
        this.emit('change');
    }

}