import MindmapType from 'vm/map/entities/Mindmap/Mindmap';

import NodeType from 'vm/map/entities/Node';
import getDistanceBetweenPoints from 'utils/get-distance-between-points';

/**
 * Gets mindmap focus node
 *
 * Focus node - is the node closest to viewport center in mindmap focus zone.
 *
 * @param {MindmapType} mindmap
 * @return {string} node id
 */
export default function getMindmapFocusNode(mindmap) {
  // observe only nodes in focus zone
  const nodesInFocus = mindmap.nodes.filter(n => !n.shaded);

  if (!nodesInFocus.length) {
    throw Error(`Mindmap has no nodes in focus zone`);
  }

  /** @type {NodeType} */
  let closestNode;
  let closestDistance = +Infinity;

  nodesInFocus.forEach(node => {
    const distance = getDistanceBetweenPoints(
      mindmap.viewbox.center,
      node.posAbs
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestNode = node;
    }
  });

  return closestNode.id;
}
