import IVertexType from 'utils/graph/interfaces/IVertex';
import IEdgeType from 'utils/graph/interfaces/IEdge';

import getRootPath from 'utils/graph/get-root-path';

/**
 * Gets vertices on the path from root to target vertex
 *
 * @param {IVertexType} root
 * @param {IVertexType} target
 * @return {array} vertices
 */
export default function getRootPathVertices(root, target) {
  /** @type {Array.<IEdgeType>} */
  const edges = getRootPath(root, target);

  if (!edges.length) {
    return [];
  }

  const vertices = edges.map(e => e.from);
  vertices.push(edges[edges.length - 1].to);

  return vertices;
}
