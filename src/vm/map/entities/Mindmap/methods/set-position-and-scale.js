import MindsetType from 'model/entities/Mindset';
import PointType from 'model/entities/Point';

import MindmapType from 'vm/map/entities/Mindmap';

import toMindmap from 'vm/map/mappers/mindset-to-mindmap';
import getMindmapPersistentProps from 'vm/map/utils/get-mindmap-persistent-props';

/**
 * Sets mindmap position and scale, which may affect position of nodes relative
 * to current weight zones and thus show/hide some nodes and links.
 *
 * @param {object} opts
 * @param {MindsetType} opts.mindset
 * @param {MindmapType} opts.mindmap
 * @param {PointType} opts.center - canvas position of viewbox center
 * @param {number} opts.scale
 * @return {Partial.<MindmapType>}
 */
export default function setPositionAndScale(opts) {
  const {mindset, mindmap, center, scale} = opts;

  // Q: why remap from model from scratch (very slow), instead of updating
  //    only what is necessary in target view model, as any other methods do?
  // A: changing scale of mindmap is quite tough operation because of zone
  //    slicing (ie. changing scale moves ideas between visibile, shaded and
  //    hidden zones), which can radically change contents of view model.
  //    so for code simplicity and maintainability, sacrificing performance,
  //    instead of clever patches on existing mindmap, we rebuild mindmap from
  //    scratch, and then extracting necessary pieces to not loose view state.
  const newMindmap = toMindmap({mindset, center, scale});
  return getMindmapPersistentProps(newMindmap, mindmap.viewport);
}
