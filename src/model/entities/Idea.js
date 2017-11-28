import initInstance from 'utils/init-instance';
import createID from 'utils/create-id';

import VertexType from 'utils/graph/interfaces/Vertex';
import EdgeType from 'utils/graph/interfaces/Edge';

import AssociationType from './Association';
import PointType from './Point';

/**
 * Idea model
 *
 * TODO: remove '= undefined' from class properties
 * as soon as babel transform automatically sets 'undefined'
 * to props without default values.
 * https://github.com/babel/babel/issues/5056
 * 
 * @implements {Vertex}
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
     * Position on mindmap relative to parent idea
     * in minimum spanning tree (MST).
     * @type {PointType}
     */
    posRel = undefined;

    // region Dynamic props (computed on run, not saved to db)

    /**
     * Absolute position on mindmap.
     * @type {PointType}
     */
    posAbs = undefined;

    /**
     * TODO: set undefined instead of empty array
     * List of outgoing associations
     * Note: available only after graph is build
     * @memberof Vertex
     * @type {Array.<AssociationType>}
     */
    edgesOut = [];

    /**
     * List of incoming associations
     * Note: available only after graph is build
     * @memberof Vertex
     * @type {Array.<AssociationType>}
     */
    edgesIn = [];

    /**
     * Edge from parent idea.
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {AssociationType}
     */
    edgeFromParent = undefined;
    
    /**
     * Edges to child ideas.
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {Array.<AssociationType>}
     */
    edgesToChilds = undefined;

    /**
     * Weight of minimal path from root (RPW).
     * Note: available only after graph is weighted
     * @memberof Vertex
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