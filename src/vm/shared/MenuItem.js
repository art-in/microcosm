/**
 * Menu item view model
 */
export default class MenuItem {

    /**
     * Menu item ID
     */
    id = Math.random();

    /**
     * Action name
     */
    actionName;

    /**
     * Display value
     */
    displayValue;

    /**
     * constructor
     * @param {string} actionName
     * @param {string} displayValue
     */
    constructor(actionName, displayValue) {
        this.actionName = actionName;
        this.displayValue = displayValue;
    }

}