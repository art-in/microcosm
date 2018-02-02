import assert from 'utils/assert';

import PointType from 'model/entities/Point';
import isValidPosition from 'model/utils/is-valid-position';
import ViewboxType from 'vm/map/entities/Viewbox';
import ViewportType from 'vm/map/entities/Viewport';

import computePositionAndSize from './compute-position-and-size';
import canScaleMore from './can-scale-more';

/**
 * Sets mindmap scale and shifts its position towards certain target position
 *
 * @param {object} opts
 * @param {ViewboxType} opts.viewbox  - mindmap viewbox
 * @param {ViewportType} opts.viewport - mindmap viewport
 * @param {object} opts.scale - target scale
 * @param {PointType} opts.canvasPos - target canvas position
 * @return {ViewboxType}
 */
export default function zoom(opts) {
  const {viewbox: vb, viewport, scale, canvasPos} = opts;

  if (!canScaleMore({viewbox: vb, up: scale > vb.scale})) {
    // do not scale out of limits
    return vb;
  }

  assert(vb.size.width > 0, `Invalid viewbox width '${vb.size.width}'`);
  assert(vb.size.height > 0, `Invalid viewbox height '${vb.size.height}'`);
  assert(isValidPosition(vb.topLeft), `Invalid viewbox top left ${vb.topLeft}`);
  assert(isValidPosition(vb.center), `Invalid viewbox center ${vb.topLeft}`);
  assert(isValidPosition(canvasPos), `Invalid canvas position ${canvasPos}`);

  const prevSize = vb.size;
  const prevCenter = vb.center;

  // compute viewbox size for new scale
  const {size: newSize} = computePositionAndSize({
    viewport,
    center: prevCenter,
    scale
  });

  // space that is hidden/shown by zoom.
  // this space will be used to shift viewbox towards target position.
  const hiddenWidth = prevSize.width - newSize.width;
  const hiddenHeight = prevSize.height - newSize.height;

  // how much current center differ from target position
  const shiftFromCenterX = canvasPos.x - prevCenter.x;
  const shiftFromCenterY = canvasPos.y - prevCenter.y;

  // what is the ratio between two lengths: center to target, center to edge.
  // this gives us factor of how much we should shift viewbox.
  const shiftFactorX = shiftFromCenterX / (prevSize.width / 2);
  const shiftFactorY = shiftFromCenterY / (prevSize.height / 2);

  // shift viewbox towards target position
  const newCenter = {
    x: prevCenter.x + hiddenWidth / 2 * shiftFactorX,
    y: prevCenter.y + hiddenHeight / 2 * shiftFactorY
  };

  // compute top-left position for new center
  return computePositionAndSize({viewport, center: newCenter, scale});
}
