import {newIdStr, mapObject} from 'lib/helpers/helpers';

/**
 * Idea model
 */
export default class Idea {

    /**
     * ID
     */
    id = newIdStr();

    /**
     * ID of parent mindmap
     */
    mindmapId = undefined;

    /**
     * Is it central idea of mindmap?
     * @type {boolean}
     */
    isCentral = false;

    /**
     * X position on mindmap canvas
     * @type {number}
     */
    x = undefined;

    /**
     * Y position on mindmap canvas
     * @type {number}
     */
    y = undefined;

    /**
     * Value
     * @type {string}
     */
    value = '';

    /**
     * Color
     * @type {string}
     */
    color = '';

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
        return `[Idea` +
            (this.isCentral ? `* ` : ` `) +
            `(mm: ${this.mindmapId}) ` +
            `(${this.id}) ` +
            `(${this.x} x ${this.y}) ` +
            `(${this.value})]`;
    }

}