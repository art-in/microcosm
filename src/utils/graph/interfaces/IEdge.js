import IVertexType from './IVertex';

/**
 * Graph edge
 * 
 * @interface
 */
export default class Edge {
    
    /**
     * Head vertex
     * @type {IVertexType}
     */
    from

    /**
     * Tail vertex
     * @type {IVertexType}
     */
    to

    /**
     * Weight of edge
     * @type {number} non-negative
     */
    weight
}