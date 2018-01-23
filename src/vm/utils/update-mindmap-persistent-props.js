import MindmapType from 'vm/map/entities/Mindmap';
import getViewboxSize from 'vm/map/entities/Mindmap/methods/get-viewbox-size';

/**
 * Updates mindmap view model by updating only persistent (saved to db) props of
 * mindmap state, and preserving view specific part of state (eg. opened popups,
 * tooltips, etc.)
 *
 * Use case: when it is easier to not update mindmap directly, but recreate from
 * model. and not replace existing mindmap because that would clear out view
 * specifics, but update existing one.
 *
 * Q: why not recreate only persistent part of mindmap from model and then
 *    update existing mindmap then (instead of recreating entire mindmap)?
 * A: yes, that would be another way to do it. not sure which one is better.
 *
 * @param {MindmapType} oldMindmap
 * @param {MindmapType} newMindmap
 */
export default function updateMindmapPersistentProps(oldMindmap, newMindmap) {
  if (oldMindmap === newMindmap) {
    return;
  }

  oldMindmap.id = newMindmap.id;

  oldMindmap.debug = newMindmap.debug;
  oldMindmap.viewbox = newMindmap.viewbox;
  oldMindmap.nodes = newMindmap.nodes;
  oldMindmap.links = newMindmap.links;
  oldMindmap.root = newMindmap.root;

  oldMindmap.viewbox = getViewboxSize({
    viewport: oldMindmap.viewport,
    viewbox: oldMindmap.viewbox
  });

  oldMindmap.isDirty = true;
}
