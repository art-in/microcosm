import required from 'utils/required-params';

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
 * @param {object}   opts.node - root node
 * @param {function} opts.visit - function to call on each node
 * @param {string}   [opts.alg='dfs-pre']
 * @param {boolean}  [opts.isTree=false] - traverse graph as tree
 */
export default function traverseGraph(opts) {
    
    const {node, visit} = required(opts);
    const alg = opts.alg || 'dfs-pre';
    const isTree = opts.isTree || false;

    switch (alg) {
    case 'dfs-pre':
    case 'dfs-post':
        dfs(node, visit, alg, isTree);
        break;
    case 'bfs':
        bfs(node, visit, isTree);
        break;
    default:
        throw Error(`Unknown traversal algorithm '${alg}'`);
    }
}

/**
 * Depth-first search (DFS)
 * 
 * @param {object} node 
 * @param {function} visit 
 * @param {string} alg 
 * @param {boolean} isTree
 * @param {Set} visitedNodes 
 */
function dfs(node, visit, alg, isTree, visitedNodes = new Set()) {
    if (visitedNodes.has(node)) {
        return;
    }

    visitedNodes.add(node);

    if (alg === 'dfs-pre') {
        visit(node);
    }

    const linksOut = isTree ?
        node.linksToChilds :
        node.linksOut;

    linksOut.forEach(link => {
        dfs(
            link.to,
            visit,
            alg,
            isTree,
            visitedNodes);
    });
    
    if (alg === 'dfs-post') {
        visit(node);
    }
}

/**
 * Breadth-first search (BFS)
 * 
 * @param {object} node 
 * @param {function} visit
 * @param {boolean} isTree
 */
function bfs(node, visit, isTree) {

    const visitedNodes = new Set();

    const queue = [];
    queue.unshift(node);

    while (queue.length) {

        const currentNode = queue.pop();

        visit(currentNode);
        visitedNodes.add(currentNode);

        const linksOut = isTree ?
            currentNode.linksToChilds :
            currentNode.linksOut;

        linksOut
            .filter(l => !visitedNodes.has(l.to))
            .forEach(l => queue.unshift(l.to));
    }
}