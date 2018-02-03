import MindmapType from 'vm/map/entities/Mindmap';

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
 * @return {Partial.<MindmapType>} update object
 */
export default function getMindmapPersistentProps(mindmap) {
  // @ts-ignore deep partial
  return {
    id: mindmap.id,
    root: mindmap.root,
    nodes: mindmap.nodes,
    links: mindmap.links,
    focusNodeLocator: mindmap.focusNodeLocator,

    debug: {
      focusIdeaId: mindmap.debug.focusIdeaId,
      focusCenter: mindmap.debug.focusCenter,
      focusZoneMax: mindmap.debug.focusZoneMax,
      shadeZoneMax: mindmap.debug.shadeZoneMax
    }
  };
}
