import MindmapType from 'vm/map/entities/Mindmap';
import NodeType from 'vm/map/entities/Node';

/**
 * Gets node by ID
 *
 * @param {MindmapType} mindmap
 * @param {string} nodeId
 * @return {NodeType}
 */
export default function getNode(mindmap, nodeId) {
  const node = mindmap.nodes.find(n => n.id === nodeId);

  if (!node) {
    throw Error(`Node with ID '${nodeId}' not found in mindmap`);
  }

  return node;
}
