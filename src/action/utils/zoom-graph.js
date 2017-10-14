import assert from 'assert';
import required from 'utils/required-params';

import computeViewboxSize from './compute-graph-viewbox-size';
import checkScaleLimits from './check-graph-scale-limits';

/**
 * Changes graph scale towards certain canvas position
 * 
 * @param {object} opts
 * @param {object} opts.viewbox  - graph viewbox
 * @param {object} opts.viewport - graph viewport
 * @param {object} opts.scale    - target scale
 * @param {Point}  opts.pos      - target canvas position
 * @return {object} viewbox
 */
export default function zoomGraph(opts) {
    const {viewbox: vb, viewport, scale, pos} = required(opts);

    if (!checkScaleLimits({viewbox: vb, up: scale > vb.scale})) {
        // do not scale out of limits
        return vb;
    }

    assert(vb.width > 0, `Invalid viewbox width '${vb.width}'`);
    assert(vb.height > 0, `Invalid viewbox height '${vb.height}'`);
    assert(vb.x !== undefined, `Invalid viewbox position x '${vb.x}'`);
    assert(vb.y !== undefined, `Invalid viewbox position y '${vb.y}'`);

    const {width: prevWidth, height: prevHeight} = vb;

    const viewbox = computeViewboxSize({viewbox: vb, viewport, scale});

    // space that will be hidden/shown by zoom
    const hiddenWidth = prevWidth - viewbox.width;
    const hiddenHeight = prevHeight - viewbox.height;

    // zoom position on viewbox (ie. not on canvas)
    const viewboxX = pos.x - viewbox.x;
    const viewboxY = pos.y - viewbox.y;

    // how much of hidden/shown space we should use
    // to shift viewbox depending on zoom position
    const shiftFactorX = viewboxX / prevWidth;
    const shiftFactorY = viewboxY / prevHeight;

    // shift viewbox toward zoom position
    viewbox.x += hiddenWidth * shiftFactorX;
    viewbox.y += hiddenHeight * shiftFactorY;

    return viewbox;
}