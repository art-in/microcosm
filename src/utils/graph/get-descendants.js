import traverseGraph from 'utils/graph/traverse-graph';

import IVertexType from 'utils/graph/interfaces/IVertex';

/**
 * Gets descendants of the vertex.
 * Descendants are all recursive childs of vertex down the tree.
 * 
 * @template T
 * @param {T} root vertex
 * @return {Array.<T>} descendant vertices
 */
export default function getDescendants(root) {

    const descendants = [];

    // @ts-ignore need function overloads (not supported) instead of generic
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