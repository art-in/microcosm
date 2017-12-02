import IEdgeType from './IEdge';

/**
 * Graph vertex
 * 
 * @interface
 */
export default class Vertex {
    
    /**
     * Indicates that vertex is graph root
     * @type {boolean}
     */
    isRoot

    /**
     * Incoming edges
     * @type {Array.<IEdgeType>}
     */
    edgesIn

    /**
     * Outgoing edges
     * @type {Array.<IEdgeType>}
     */
    edgesOut

    /**
     * Edge from parent vertex in minimum spanning tree (MST).
     * One of incoming edges.
     * @type {IEdgeType}
     */
    edgeFromParent

    /**
     * Edges to child vertices in minimum spanning tree (MST).
     * Subset of outgoing edges.
     * @type {Array.<IEdgeType>}
     */
    edgesToChilds

    /**
     * Weight of minimal path from root (RPW)
     * @type {number}
     */
    rootPathWeight
}