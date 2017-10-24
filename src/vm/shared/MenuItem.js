import initProps from 'utils/init-props';

/**
 * Menu item
 */
export default class MenuItem {

    /**
     * Menu item ID
     */
    id = Math.random();

    /**
     * Display value
     */
    displayValue = undefined;

    /**
     * Indicates item is ready to be selected
     * @type {boolean}
     */
    enabled = true;

    /**
     * Gets action after item selected
     * @type {function}
     */
    onSelectAction = undefined;

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        initProps(this, props);
    }

}