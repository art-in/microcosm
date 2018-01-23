import assert from 'utils/assert';
import clone from 'clone';

import PointType from 'model/entities/Point';

import getViewboxSize from './get-viewbox-size';
import canScaleMore from './can-scale-more';

/**
 * Changes mindmap scale towards certain canvas position
 *
 * @param {object} opts
 * @param {object} opts.viewbox  - mindmap viewbox
 * @param {object} opts.viewport - mindmap viewport
 * @param {object} opts.scale    - target scale
 * @param {PointType} opts.canvasPos - target canvas position
 * @return {object} viewbox
 */
export default function zoomMindmap(opts) {
  const {viewbox: vb, viewport, scale, canvasPos} = opts;

  if (!canScaleMore({viewbox: vb, up: scale > vb.scale})) {
    // do not scale out of limits
    return vb;
  }

  assert(vb.width > 0, `Invalid viewbox width '${vb.width}'`);
  assert(vb.height > 0, `Invalid viewbox height '${vb.height}'`);
  assert(vb.x !== undefined, `Invalid viewbox position x '${vb.x}'`);
  assert(vb.y !== undefined, `Invalid viewbox position y '${vb.y}'`);

  const {width: prevWidth, height: prevHeight} = vb;

  let newViewbox = clone(vb);
  newViewbox.scale = scale;

  newViewbox = getViewboxSize({viewbox: newViewbox, viewport});

  // space that will be hidden/shown by zoom
  const hiddenWidth = prevWidth - newViewbox.width;
  const hiddenHeight = prevHeight - newViewbox.height;

  // zoom position on viewbox (ie. not on canvas)
  const viewboxX = canvasPos.x - newViewbox.x;
  const viewboxY = canvasPos.y - newViewbox.y;

  // how much of hidden/shown space we should use
  // to shift viewbox depending on zoom position
  const shiftFactorX = viewboxX / prevWidth;
  const shiftFactorY = viewboxY / prevHeight;

  // shift viewbox toward zoom position
  newViewbox.x += hiddenWidth * shiftFactorX;
  newViewbox.y += hiddenHeight * shiftFactorY;

  return newViewbox;
}
