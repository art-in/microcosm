/**
 * Graph edge
 * 
 * @interface
 */
export default class Edge {
    
    /**
     * Head vertex
     * @type {Vertex}
     */
    from

    /**
     * Tail vertex
     * @type {Vertex}
     */
    to

    /**
     * Weight of edge
     * @type {number} non-negative
     */
    weight
}