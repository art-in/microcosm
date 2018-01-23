import IVertexType from "utils/graph/interfaces/IVertex";
import IEdgeType from "utils/graph/interfaces/IEdge";

/**
 * Gets edges on the path from root to target vertex
 *
 * Q: why resulting array is not typed?
 * A: because typescript does not support narrowing generic types
 *
 * @param {IVertexType} root
 * @param {IVertexType} target
 * @return {array} edges
 */
export default function getRootPath(root, target) {
  const path = [];
  let current = target;

  while (current !== root) {
    path.push(current.edgeFromParent);
    current = current.edgeFromParent.from;
  }

  // reverse path so direction is from root
  return path.reverse();
}
