import required from 'utils/required-params';

const charCodeA = 65;
const charCount = 26;

/**
 * Generic function for building object graph from adjacency matrix
 * 
 * Q: Why input matrix is array of strings and not array of number arrays?
 * A: Because it is possible to align columns without violating lint rules.
 * 
 * @param {object}         opts
 * @param {array.<string>} opts.matrix
 * @param {function}       opts.VertexConstructor
 * @param {function}       opts.EdgeConstructor
 * @return {object} root vertex
 */
export default function buildGraphFromMatrix(opts) {
    const {matrix: m, VertexConstructor, EdgeConstructor} = required(opts);

    // validate input
    if (!Array.isArray(m) ||
        !m.every(l => typeof l === 'string')) {
        throw Error('Invalid matrix. Expecting array of strings');
    }

    const vertexCount = m.length;

    if (vertexCount > charCount) {
        throw Error(`Invalid matrix. Too much vertices (>${charCount})`);
    }

    // create vertices (A, B, C, etc.)
    const vertices = [];
    for (let i = 0; i < vertexCount; i++) {
        const id = String.fromCharCode(charCodeA + i);
        const vertex = new VertexConstructor({id});
        vertex.edgesIn = [];
        vertex.edgesOut = [];
        vertices.push(vertex);
    }

    // parse and validate matrix
    // @type {array.<array<number>>}
    const matrix = [];

    m.forEach((line, headVertexIdx) => {

        const headId = vertices[headVertexIdx].id;

        // parse weights of outgoing edges
        const edgeWeights = line
            .split(' ')
            .filter(s => s !== '')
            .map(edgeWeightStr => {
                const edgeWeight = Number(edgeWeightStr);
                if (!Number.isFinite(edgeWeight) || edgeWeight < 0) {
                    throw Error(
                        `Invalid outgoing edge weight '${edgeWeightStr}' ` +
                        `for vertex '${headId}'`);
                }
                return edgeWeight;
            });

        if (edgeWeights.length !== vertexCount) {
            throw Error(
                `Invalid matrix. Wrong number of columns for vertex ` +
                `'${headId}'`);
        }

        if (edgeWeights[headVertexIdx] !== 0) {
            throw Error(
                `Self loops are not allowed. Main diagonal should be zero ` +
                `for vertex '${headId}'`);
        }

        if (edgeWeights[0] > 0) {
            throw Error(
                `Edge towards root is not allowed for vertex '${headId}'`);
        }

        matrix.push(edgeWeights);

        edgeWeights.forEach((w, tailVertexIdx) => {
            if (matrix[headVertexIdx] !== undefined &&
                matrix[tailVertexIdx] !== undefined &&
                matrix[headVertexIdx][tailVertexIdx] > 0 &&
                matrix[tailVertexIdx][headVertexIdx] > 0) {
                throw Error(
                    `Mutual edges are not allowed between vertices ` +
                    `'${headId}' and '${vertices[tailVertexIdx].id}'`);
            }
        });
    });

    // bind vertices and edges
    const edges = [];
    matrix.forEach((edgeWeights, headVertexIdx) => {

        edgeWeights.forEach((edgeWeight, tailVertexIdx) => {

            if (edgeWeight === 0) {
                // no edge
                return;
            }

            const head = vertices[headVertexIdx];
            const tail = vertices[tailVertexIdx];

            const edge = new EdgeConstructor({
                id: `${head.id} to ${tail.id}`,

                fromId: head.id,
                from: head,
                toId: tail.id,
                to: tail,

                weight: edgeWeight
            });

            head.edgesOut.push(edge);
            tail.edgesIn.push(edge);

            edges.push(edge);
        });
    });

    // vertex 'A' is always root
    const root = vertices[0];
    root.isRoot = true;

    return {root, vertices, edges};
}