import initProps from 'utils/init-props';

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
     * @param {Partial<MenuItem>} [props]
     */
    constructor(props) {
        initProps(this, props);
    }
}