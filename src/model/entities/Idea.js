import initInstance from 'utils/init-instance';
import createID from 'utils/create-id';

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
    id = createID();

    /**
     * ID of parent mindmap
     */
    mindmapId = undefined;

    /**
     * Indicates that idea is root idea of mindmap
     * @type {boolean}
     */
    isRoot = false;

    /**
     * Distance from root
     * @type {number}
     */
    depth = undefined;

    /**
     * List of outgoing associations
     * Note: available only after graph is build
     * @type {array.<Association>}
     */
    associationsOut = [];

    /**
     * List of incoming associations
     * Note: available only after graph is build
     * @type {array.<Association>}
     */
    associationsIn = [];

    /**
     * [Node interface]
     * List of outgoing links
     */
    get linksOut() {
        return this.associationsOut;
    }

    /**
     * [Node interface]
     * Sets list of outgoing links
     * @param {array.<Association>} associations
     */
    set linksOut(associations) {
        this.associationsOut = associations;
    }

    /**
     * [Node interface]
     * List of incoming links
     */
    get linksIn() {
        return this.associationsIn;
    }

    /**
     * [Node interface]
     * Sets list of incoming links
     * @param {array.<Association>} associations
     */
    set linksIn(associations) {
        this.associationsIn = associations;
    }

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
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        initInstance(this, props);
    }
}