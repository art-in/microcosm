/**
 * Lookup suggestion vm 
 */
export default class LookupSuggestion {

    /**
     * Unique id of suggestion
     * @type {string}
     */
    id = undefined;

    /**
     * Any data associated with this suggestion
     * @type {*}
     */
    data = undefined;

    /**
     * Display name
     * @type {string}
     */
    displayName = undefined;

    /**
     * Constructor
     * @param {*} data 
     * @param {string} displayName 
     */
    constructor(data, displayName) {
        this.id = data;
        this.data = data;
        this.displayName = displayName;
    }

}