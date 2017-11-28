import EdgeType from './Edge';

/**
 * Graph vertex
 * 
 * @interface
 */
export default class Vertex {
    
    /**
     * Incoming edges
     * @type {Array.<EdgeType>}
     */
    edgesIn

    /**
     * Outgoing edges
     * @type {Array.<EdgeType>}
     */
    edgesOut

    /**
     * Edge from parent vertex in minimum spanning tree (MST).
     * One of incoming edges.
     * @type {EdgeType}
     */
    edgeFromParent

    /**
     * Edges to child vertices in minimum spanning tree (MST).
     * Subset of outgoing edges.
     * @type {Array.<EdgeType>}
     */
    edgesToChilds

    /**
     * Weight of minimal path from root (RPW)
     * @type {number}
     */
    rootPathWeight
}