import required from 'utils/required-params';
import traverseGraph from 'utils/graph/traverse-graph';

/**
 * Generic function for building object graph
 * from arrays of vertices and edges objects
 * 
 * @param {object}         opts
 * @param {array.<object>} opts.vertices
 * @param {array.<object>} opts.edges
 * @param {function}       opts.isRootVertex - checks if passed vertex is root
 * @return {object} root vertex
 */
export default function buildGraph(opts) {
    const {vertices, edges, isRootVertex} = required(opts);

    let rootVertex = null;

    const visitedVertices = new Set();

    if (edges.length === 0 && vertices.length === 1 &&
        isRootVertex(vertices[0])) {
        
        // graph of single root vertex
        rootVertex = vertices[0];
        rootVertex.edgesIn = [];
        rootVertex.edgesOut = [];

        return rootVertex;
    }

    edges.forEach(edge => {

        // set head/tail vertex to edge
        const vertexHead = vertices.find(i => i.id === edge.fromId);
        if (!vertexHead) {
            throw Error(
                `Head vertex '${edge.fromId}' ` +
                `of edge '${edge.id}' was not found`);
        }

        const vertexTail = vertices.find(i => i.id === edge.toId);
        if (!vertexTail) {
            throw Error(
                `Tail vertex '${edge.toId}' ` +
                `of edge '${edge.id}' was not found`);
        }

        edge.from = vertexHead;
        edge.to = vertexTail;
        
        // mark visited vertices
        visitedVertices.add(vertexHead);
        visitedVertices.add(vertexTail);

        // init edges
        vertexHead.edgesIn = vertexHead.edgesIn || [];
        vertexTail.edgesIn = vertexTail.edgesIn || [];
        vertexHead.edgesOut = vertexHead.edgesOut || [];
        vertexTail.edgesOut = vertexTail.edgesOut || [];

        // add edge to head vertex as outgoing edge
        vertexHead.edgesOut.push(edge);

        // add edge to tail vertex as incoming edge
        vertexTail.edgesIn.push(edge);

        // mark root vertex
        if (isRootVertex(vertexHead)) {
            rootVertex = vertexHead;
        }
    });

    // check root exists
    if (!rootVertex) {
        throw Error(`No root vertex was found`);
    }

    // check all vertices can be reached from the root
    // TODO: this additional validational traversal can hit performance
    //       for big graphs
    visitedVertices.clear();
    traverseGraph({
        root: rootVertex,
        visit: vertex => {
            visitedVertices.add(vertex);
        }
    });

    const notVisitedVertices = vertices
        .filter(n => !visitedVertices.has(n))
        .map(n => n.id);

    if (notVisitedVertices.length) {
        throw Error(
            `Some vertices cannot be reached from root: '` +
            `${notVisitedVertices.join('\', \'')}'`);
    }

    return rootVertex;
}