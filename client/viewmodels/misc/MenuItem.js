/**
 * Menu item view model
 */
export default class MenuItem {

    /**
     * Menu item ID
     */
    id = Math.random();

    /**
     * Display value of menu item
     */
    displayValue;

    /**
     * constructor
     * @param {string} displayName
     */
    constructor(displayName) {
        this.displayValue = displayName;
    }

}