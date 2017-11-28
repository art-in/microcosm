import initInstance from 'utils/init-instance';

/**
 * Lookup suggestion
 */
export default class LookupSuggestion {

    /**
     * Unique id of suggestion
     * @type {string}
     */
    id = Math.random().toString();

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
     * @param {object} [props]
     */
    constructor(props) {
        return initInstance(this, props);
    }
}