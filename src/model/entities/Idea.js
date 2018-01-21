import initProps from 'utils/init-props';
import createID from 'utils/create-id';

import IVertexType from 'utils/graph/interfaces/IVertex';
import IEdgeType from 'utils/graph/interfaces/IEdge';

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
     * @type {string}
     */
    id = createID();

    /**
     * ID of parent mindset
     * @type {string|undefined}
     */
    mindsetId = undefined;

    /**
     * Indicates that idea is root idea of mindset
     * @type {boolean}
     */
    isRoot = false;
    
    /**
     * Short essence of idea
     * @type {string|undefined}
     */
    title = undefined;

    /**
     * Full description of idea
     * @type {string|undefined}
     */
    value = undefined;

    /**
     * Own color of idea (not inherited)
     * @type {string|undefined}
     */
    color = undefined;

    /**
     * Position on mindset relative to parent idea
     * in minimum spanning tree (MST).
     * @type {PointType|undefined}
     */
    posRel = undefined;

    // region Dynamic props (computed on run, not saved to db)

    /**
     * Absolute position on mindset.
     * @type {PointType|undefined}
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
     * @type {AssociationType?|undefined}
     */
    edgeFromParent = undefined;
    
    /**
     * Edges to child ideas.
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {Array.<AssociationType>|undefined}
     */
    edgesToChilds = undefined;

    /**
     * Weight of minimal path from root (RPW).
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {number|undefined}
     */
    rootPathWeight = undefined;

    // endregion

    /**
     * Constructor
     * @param {Partial<Idea>} [props]
     */
    constructor(props) {
        initProps(this, props);
    }
}