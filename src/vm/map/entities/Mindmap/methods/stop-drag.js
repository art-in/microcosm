import MindmapType from 'vm/map/entities/Mindmap/Mindmap';

/**
 * Creates update object to stop mindmap dragging node
 *
 * @return {Partial.<MindmapType>} update object
 */
export default function() {
  return {
    drag: {
      active: false,
      node: null,
      nodes: null,
      startX: null,
      startY: null
    }
  };
}
