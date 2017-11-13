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
     * Position on mindmap relative to parent idea in
     * minimum spanning tree (MST).
     * @type {Point}
     */
    posRel = undefined;

    // region Dynamic props (computed on run, not saved to db)

    /**
     * Absolute position on mindmap.
     * @type {Point}
     */
    posAbs = undefined;

    /**
     * TODO: remove extensions, leave interface props only
     * TODO: set undefined instead of empty array
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
     * [Node interface]
     * Link to parent idea.
     * Note: available only after graph is weighted
     * @type {Link}
     */
    linkFromParent = undefined;
    
    /**
     * [Node interface]
     * Links to child ideas.
     * Note: available only after graph is weighted
     * @type {array.<Link>}
     */
    linksToChilds = undefined;

    /**
     * [Node interface]
     * Weight of minimal path from root (RPW).
     * Note: available only after graph is weighted
     * @type {number}
     */
    rootPathWeight = undefined;

    // endregion

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        return initInstance(this, props);
    }
}