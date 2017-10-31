/**
 * Generic function for graph traversal
 * 
 * @param {object} node - root node
 * @param {function} visit - function to call on each node
 * @param {string} [mode='dfs-pre'] - dfs-pre  - depth-first search pre-order
 *                                    dfs-post - depth-first search post order
 *                                    bfs      - breadth-first search
 */
export default function traverseGraph(
    node,
    visit,
    mode = 'dfs-pre') {
    
    switch (mode) {
    case 'dfs-pre':
    case 'dfs-post':
        dfs(node, visit, mode);
        break;
    case 'bfs':
        bfs(node, visit);
        break;
    default:
        throw Error(`Unknown traversal mode '${mode}'`);
    }
}

/**
 * Depth-first search (DFS)
 * 
 * @param {object} node 
 * @param {function} visit 
 * @param {string} mode 
 * @param {Set} visitedNodes 
 */
function dfs(node, visit, mode, visitedNodes = new Set()) {
    if (visitedNodes.has(node)) {
        return;
    }

    visitedNodes.add(node);

    if (mode === 'dfs-pre') {
        visit(node);
    }

    node.linksOut.forEach(link => {
        dfs(
            link.to,
            visit,
            mode,
            visitedNodes);
    });
    
    if (mode === 'dfs-post') {
        visit(node);
    }
}

/**
 * Breadth-first search (BFS)
 * 
 * @param {object} node 
 * @param {function} visit 
 */
function bfs(node, visit) {

    const visitedNodes = new Set();

    const queue = [];
    queue.unshift(node);

    while (queue.length) {

        const currentNode = queue.pop();

        visit(currentNode);
        visitedNodes.add(currentNode);

        currentNode.linksOut
            .filter(l => !visitedNodes.has(l.to))
            .forEach(l => queue.unshift(l.to));
    }
}