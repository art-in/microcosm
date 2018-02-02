import MindmapType from 'vm/map/entities/Mindmap';
import computePositionAndSize from 'vm/map/entities/Viewbox/methods/compute-position-and-size';
import ViewportType from 'vm/map/entities/Viewport';

/**
 * Extracts props affected by persistent (saved to db) props of model from
 * mindmap view model, leaving view specific part of its state (eg. opened
 * popups, tooltips, etc.)
 *
 * Use case: when it is easier to not update mindmap directly, but recreate from
 * model. and not replace existing mindmap because that would clear out view
 * specifics, but update existing one.
 *
 * @param {MindmapType} mindmap
 * @param {ViewportType} viewport
 * @return {Partial.<MindmapType>} update object
 */
export default function getMindmapPersistentProps(mindmap, viewport) {
  // @ts-ignore deep partial
  return {
    id: mindmap.id,
    root: mindmap.root,
    nodes: mindmap.nodes,
    links: mindmap.links,
    focusNodeLocator: mindmap.focusNodeLocator,

    // keep position and size for prev viewport
    viewbox: computePositionAndSize({
      viewport,
      center: mindmap.viewbox.center,
      scale: mindmap.viewbox.scale
    }),

    debug: {
      focusIdeaId: mindmap.debug.focusIdeaId,
      focusCenter: mindmap.debug.focusCenter,
      focusZoneMax: mindmap.debug.focusZoneMax,
      shadeZoneMax: mindmap.debug.shadeZoneMax
    }
  };
}
