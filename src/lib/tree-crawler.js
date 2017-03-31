/**
 * Calls callback function on each node in the tree
 * @param {Node} node
 * @param {function} cb
 */
export function traverseTree(node, cb) {
    node.links.forEach(l => {
        traverseTree(l.toNode, cb);
    });
    cb(node);
}