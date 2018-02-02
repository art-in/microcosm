import assert from 'utils/assert';

import PointType from 'model/entities/Point';
import ViewportType from 'vm/map/entities/Viewport';
import Viewbox from 'vm/map/entities/Viewbox';
import MindmapType from 'vm/map/entities/Mindmap';
import isValidPosition from 'model/utils/is-valid-position';

/**
 * Computes viewbox position and size to keep computed props in sync
 *
 * @param {object} opts
 * @param {ViewportType} opts.viewport
 * @param {PointType} opts.center
 * @param {number} opts.scale
 * @return {Viewbox}
 */
export default function computePositionAndSize(opts) {
  const {viewport, center, scale} = opts;

  assert(viewport.width > 0, `Invalid viewport width '${viewport.width}'`);
  assert(viewport.height > 0, `Invalid viewport height '${viewport.height}'`);
  assert(isValidPosition(center), `Invalid center position ${center}`);

  const {min, max} = Math;

  const viewbox = new Viewbox();

  viewbox.scale = max(viewbox.scaleMin, scale);
  viewbox.scale = min(viewbox.scaleMax, scale);

  viewbox.center = center;

  // computed props
  viewbox.size.width = viewport.width / viewbox.scale;
  viewbox.size.height = viewport.height / viewbox.scale;

  viewbox.topLeft.x = viewbox.center.x - viewbox.size.width / 2;
  viewbox.topLeft.y = viewbox.center.y - viewbox.size.height / 2;

  return viewbox;
}
