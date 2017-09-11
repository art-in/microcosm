/**
 * Generic function for depth-first graph traversal,
 * which calls function on each node of the graph
 * 
 * @param {object} opts
 * @param {object} opts.node - root node
 * @param {function} opts.visit - function to call on each node
 * @param {bool} [opts.order='pre'] - pre-order or post-order traversal
 * @param {Set} visitedNodes
 */
export default function traverseGraph({
    node,
    visit,
    order = 'pre'
}, visitedNodes = new Set()) {
    
    if (visitedNodes.has(node)) {
        return;
    }

    visitedNodes.add(node);

    if (order === 'pre') {
        visit(node);
    }

    node.links.forEach(link => {
        traverseGraph({
            node: link.to,
            visit,
            order
        }, visitedNodes);
    });
    
    if (order === 'post') {
        visit(node);
    }
}