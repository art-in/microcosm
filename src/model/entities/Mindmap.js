import createID from 'utils/create-id';
import mapObject from 'utils/map-object';

/**
 * Mindmap model
 */
export default class Mindmap {

    /**
     * ID
     */
    id = createID();

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
     * @type {Map.<Idea>}
     */
    ideas = new Map();

    /**
     * Associations
     * @type {Map.<Association>}
     */
    associations = new Map();

    /**
     * Root of ideas graph
     * Note: available only after graph is build
     * @type {Idea}
     */
    root = undefined;

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