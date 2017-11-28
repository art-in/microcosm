import VertexType from './Vertex';

/**
 * Graph edge
 * 
 * @interface
 */
export default class Edge {
    
    /**
     * Head vertex
     * @type {VertexType}
     */
    from

    /**
     * Tail vertex
     * @type {VertexType}
     */
    to

    /**
     * Weight of edge
     * @type {number} non-negative
     */
    weight
}