import {newIdStr, mapObject} from 'lib/helpers/helpers';

/**
 * Mindmap model
 */
export default class Mindmap {

    /**
     * ID
     */
    id = newIdStr();

    /**
     * ID of parent mindmap
     */
    mindmapId = undefined;

    /**
     * X position of viewbox on the canvas
     * @type {number}
     */
    x = undefined;

    /**
     * Y position of viewbox on the canvas
     * @type {number}
     */
    y = undefined;

    /**
     * Scale of viewbox on the canvas
     * @type {number}
     */
    scale = undefined;

    /**
     * Ideas
     * @type {array.<Idea>}
     */
    ideas = [];

    /**
     * Associations
     * @type {array.<Association>}
     */
    assocs = [];

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
        return `[Mindmap ` +
            `(${this.x} - ${this.y}) (${this.scale})` +
            `]`;
    }

}