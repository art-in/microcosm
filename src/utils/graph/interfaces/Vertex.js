/**
 * Graph vertex
 * 
 * @interface
 */
export default class Vertex {
    
    /**
     * Incoming edges
     * @type {array.<Edge>}
     */
    edgesIn

    /**
     * Outgoing edges
     * @type {array.<Edge>}
     */
    edgesOut

    /**
     * Edge from parent vertex in minimum spanning tree (MST).
     * One of incoming edges.
     * @type {Edge}
     */
    edgeFromParent

    /**
     * Edges to child vertices in minimum spanning tree (MST).
     * Subset of outgoing edges.
     * @type {array.<Edge>}
     */
    edgesToChilds

    /**
     * Weight of minimal path from root (RPW)
     * @type {number}
     */
    rootPathWeight
}