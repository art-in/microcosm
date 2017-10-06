import assert from 'assert';

/**
 * Menu item view model
 */
export default class MenuItem {

    /**
     * Menu item ID
     */
    id = Math.random();

    /**
     * Display value
     */
    displayValue;

    /**
     * Gets action after item selected
     * @type {function}
     */
    onSelectAction = null;

    /**
     * Constructor
     * @param {object} opts
     */
    constructor({displayValue, onSelectAction}) {
        assert(displayValue !== undefined);
        assert(onSelectAction !== undefined);

        this.displayValue = displayValue;
        this.onSelectAction = onSelectAction.bind(this, this);
    }

}