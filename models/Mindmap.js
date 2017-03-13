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
    x = 0;

    /**
     * Y position of viewbox on the canvas
     * @type {number}
     */
    y = 0;

    /**
     * Scale of viewbox on the canvas
     * @type {number}
     */
    scale = 0;

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