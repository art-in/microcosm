import MindmapType from 'vm/map/entities/Mindmap/Mindmap';

/**
 * Stops dragging node
 *
 * @return {Partial.<MindmapType>} update object
 */
export default function stopDrag() {
  return {
    drag: {
      active: false,
      node: null,
      nodes: null,
      prev: null
    }
  };
}
