import assert from 'assert';
import clone from 'clone';
import required from 'utils/required-params';

/**
 * Computes viewbox size
 * 
 * @param {object} opts
 * @param {object} opts.viewport
 * @param {object} opts.viewbox
 * @return {object}
 */
export default function computeViewboxSize(opts) {
    const {viewport, viewbox: vb} = required(opts);

    assert(viewport.width > 0, `Invalid viewport width '${viewport.width}'`);
    assert(viewport.height > 0, `Invalid viewport height '${viewport.height}'`);

    const {min, max, round} = Math;

    const viewbox = clone(vb);

    viewbox.scale = max(viewbox.scaleMin, viewbox.scale);
    viewbox.scale = min(viewbox.scaleMax, viewbox.scale);
    viewbox.scale = round(viewbox.scale * 100) / 100;

    viewbox.width = round(viewport.width / viewbox.scale);
    viewbox.height = round(viewport.height / viewbox.scale);

    return viewbox;
}