/**
 * Generic function for graph traversal
 * 
 * Algorithms:
 * 
 * dfs-pre  - depth-first search pre-order
 * dfs-post - depth-first search post order
 * bfs      - breadth-first search
 * 
 * @param {object}   opts
 * @param {object}   opts.root - root vertex
 * @param {function} opts.visit - function to call on each vertex
 * @param {string}   [opts.alg='dfs-pre']
 * @param {boolean}  [opts.isTree=false] - traverse graph as tree
 */
export default function traverseGraph(opts) {
    
    const {
        root,
        visit,
        alg = 'dfs-pre',
        isTree = false
    } = opts;

    switch (alg) {
    case 'dfs-pre':
    case 'dfs-post':
        dfs(root, visit, alg, isTree);
        break;
    case 'bfs':
        bfs(root, visit, isTree);
        break;
    default:
        throw Error(`Unknown traversal algorithm '${alg}'`);
    }
}

/**
 * Depth-first search (DFS)
 * 
 * @param {object} vertex 
 * @param {function} visit 
 * @param {string} alg 
 * @param {boolean} isTree
 * @param {Set} visitedVertices 
 */
function dfs(vertex, visit, alg, isTree, visitedVertices = new Set()) {
    if (visitedVertices.has(vertex)) {
        return;
    }

    visitedVertices.add(vertex);

    if (alg === 'dfs-pre') {
        visit(vertex);
    }

    const edgesOut = isTree ?
        vertex.edgesToChilds :
        vertex.edgesOut;

    edgesOut.forEach(edge => {
        dfs(
            edge.to,
            visit,
            alg,
            isTree,
            visitedVertices);
    });
    
    if (alg === 'dfs-post') {
        visit(vertex);
    }
}

/**
 * Breadth-first search (BFS)
 * 
 * @param {object} vertex 
 * @param {function} visit
 * @param {boolean} isTree
 */
function bfs(vertex, visit, isTree) {

    const visitedVertices = new Set();

    const queue = [];
    queue.unshift(vertex);

    while (queue.length) {

        const currentVertex = queue.pop();

        visit(currentVertex);
        visitedVertices.add(currentVertex);

        const edgesOut = isTree ?
            currentVertex.edgesToChilds :
            currentVertex.edgesOut;

        edgesOut
            .filter(l => !visitedVertices.has(l.to))
            .forEach(l => queue.unshift(l.to));
    }
}