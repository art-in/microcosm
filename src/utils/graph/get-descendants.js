import traverseGraph from 'utils/graph/traverse-graph';

/**
 * Gets descendants of the vertex.
 * Descendants are all recursive childs of vertex down the tree.
 * 
 * @param {object} root vertex
 * @return {Array.<object>} descendant vertices
 */
export default function getDescendants(root) {

    const descendants = [];

    traverseGraph({
        root,
        isTree: true,
        visit: vertex => {
            if (vertex !== root) {
                descendants.push(vertex);
            }
        }
    });

    return descendants;
}