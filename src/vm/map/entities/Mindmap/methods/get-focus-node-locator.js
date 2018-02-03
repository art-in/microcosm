import NodeType from 'vm/map/entities/Node';
import NodeLocator from 'vm/map/entities/NodeLocator';
import MindmapType from 'vm/map/entities/Mindmap/Mindmap';

/**
 * Gets locator for focus node
 *
 * @param {Array.<NodeType>} nodes
 * @param {string} focusIdeaId
 * @return {NodeLocator}
 */
export default function getFocusNodeLocator(nodes, focusIdeaId) {
  const focusNode = nodes.find(n => n.id === focusIdeaId);

  if (!focusNode) {
    throw Error(
      `Focus idea '${focusIdeaId}' has no corresponding node in mindmap`
    );
  }

  return new NodeLocator({
    pos: focusNode.posAbs,
    scale: focusNode.scale
  });
}
