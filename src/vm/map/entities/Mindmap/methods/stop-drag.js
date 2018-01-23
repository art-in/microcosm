/**
 * Creates update object to stop mindmap dragging node
 *
 * @return {object} mindmap update object
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
