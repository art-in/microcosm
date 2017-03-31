import {newIdStr, mapObject} from 'lib/helpers/helpers';

/**
 * Idea model
 *
 * TODO: remove '= undefined' from class properties
 * as soon as babel transform automatically sets 'undefined'
 * to props without default values.
 * https://github.com/babel/babel/issues/5056
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
    value = undefined;

    /**
     * Color
     * @type {string}
     */
    color = undefined;

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