import {newIdStr, mapObject} from 'lib/helpers/helpers';

/**
 * Association model
 */
export default class Association {

    /**
     * ID
     * @type {string}
     */
    id = newIdStr();

    /**
     * ID of start node
     * @type {string}
     */
    from = undefined;

    /**
     * ID of end node
     * @type {string}
     */
    to = undefined;
    
    /**
     * Value
     * @type {string}
     */
    value = undefined;

    /**
     * constructor
     * @param {object} obj
     */
    constructor(obj) {
        if (obj) {
            mapObject(this, obj);
        }
    }

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Association ` +
            `(${this.id}) ` +
            `(${this.from} - ${this.to}) ` +
            `(${this.value})]`;
    }
}