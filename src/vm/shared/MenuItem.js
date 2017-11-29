import initInstance from 'utils/init-instance';

/**
 * Menu item
 */
export default class MenuItem {

    /**
     * Menu item ID
     * @type {string}
     */
    id = Math.random().toString();

    /**
     * Display value
     * @type {string|undefined}
     */
    displayValue = undefined;

    /**
     * Indicates item is ready to be selected
     * @type {boolean}
     */
    enabled = true;

    /**
     * Gets action after item selected
     * @type {function|undefined}
     */
    onSelectAction = undefined;

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        return initInstance(this, props);
    }
}