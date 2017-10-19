import assert from 'utils/assert';
import clone from 'clone';
import required from 'utils/required-params';

import computeViewboxSize from './compute-viewbox-size';
import checkScaleLimits from './check-scale-limits';

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

    let newViewbox = clone(vb);
    newViewbox.scale = scale;

    newViewbox = computeViewboxSize({viewbox: newViewbox, viewport});

    // space that will be hidden/shown by zoom
    const hiddenWidth = prevWidth - newViewbox.width;
    const hiddenHeight = prevHeight - newViewbox.height;

    // zoom position on viewbox (ie. not on canvas)
    const viewboxX = pos.x - newViewbox.x;
    const viewboxY = pos.y - newViewbox.y;

    // how much of hidden/shown space we should use
    // to shift viewbox depending on zoom position
    const shiftFactorX = viewboxX / prevWidth;
    const shiftFactorY = viewboxY / prevHeight;

    // shift viewbox toward zoom position
    newViewbox.x += hiddenWidth * shiftFactorX;
    newViewbox.y += hiddenHeight * shiftFactorY;

    return newViewbox;
}