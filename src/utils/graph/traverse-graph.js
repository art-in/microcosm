/**
 * Generic function for depth-first graph traversal,
 * which calls function on each node of the graph
 * 
 * @param {object} node - root node
 * @param {function} visit - function to call on each node
 * @param {bool} [order='pre'] - pre-order or post-order traversal
 * @param {Set} visitedNodes
 */
export default function traverseGraph(
    node,
    visit,
    order = 'pre',
    visitedNodes = new Set()) {
    
    if (visitedNodes.has(node)) {
        return;
    }

    visitedNodes.add(node);

    if (order === 'pre') {
        visit(node);
    }

    node.linksOut.forEach(link => {
        traverseGraph(
            link.to,
            visit,
            order,
            visitedNodes);
    });
    
    if (order === 'post') {
        visit(node);
    }
}