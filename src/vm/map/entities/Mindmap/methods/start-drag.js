import getDescendants from 'utils/graph/get-descendants';

import Point from 'model/entities/Point';
import MindmapType from 'vm/map/entities/Mindmap';
import NodeType from 'vm/map/entities/Node';

/**
 * Starts dragging node
 *
 * @param {NodeType} node
 * @return {Partial.<MindmapType>} update object
 */
export default function startDrag(node) {
  // drag child sub-tree
  const descendants = getDescendants(node);

  return {
    drag: {
      active: true,
      node,
      nodes: [node, ...descendants],

      prev: new Point(node.posAbs)
    }
  };
}
