import traverseGraph from 'utils/graph/traverse-graph';

/**
 * Gets descendants of the node.
 * Descendants are all recursive childs of node down the tree.
 * 
 * @param {object} root node
 * @return {array.<object>} descendant nodes
 */
export default function getDescendants(root) {

    const descendants = [];

    traverseGraph({
        node: root,
        isTree: true,
        visit: node => {
            if (node !== root) {
                descendants.push(node);
            }
        }
    });

    return descendants;
}