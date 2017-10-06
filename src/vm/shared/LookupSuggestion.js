/**
 * Lookup suggestion vm 
 */
export default class LookupSuggestion {

    /**
     * Unique id of suggestion
     * @type {string}
     */
    id = Math.random();

    /**
     * Display name
     * @type {string}
     */
    displayName = undefined;

    /**
     * Any data associated with this suggestion
     * @type {*}
     */
    data = undefined;

    /**
     * Constructor
     * @param {object}   data
     * @param {string}   data.displayName 
     * @param {*}        data.data
     */
    constructor({displayName, data}) {
        this.displayName = displayName;
        this.data = data;
    }

}