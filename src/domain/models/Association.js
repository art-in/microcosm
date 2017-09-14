import createID from 'lib/helpers/create-id';
import mapObject from 'lib/helpers/map-object';

/**
 * Association model
 */
export default class Association {

    /**
     * ID
     * @type {string}
     */
    id = createID();

    /**
     * ID of start idea
     * @type {string}
     */
    fromId = undefined;

    /**
     * Start idea
     * Note: available only after graph is build
     * @type {Idea}
     */
    from = undefined;

    /**
     * ID of end idea
     * @type {string}
     */
    toId = undefined;

    /**
     * End idea
     * Note: available only after graph is build
     * @type {Idea}
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