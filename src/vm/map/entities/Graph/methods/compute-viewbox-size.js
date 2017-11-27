import clone from 'clone';
import assert from 'utils/assert';
import required from 'utils/required-params';

/**
 * Computes viewbox size
 * TODO: rename to get-viewbox-size for briefity
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

    const {min, max} = Math;

    const viewbox = clone(vb);

    viewbox.scale = max(viewbox.scaleMin, viewbox.scale);
    viewbox.scale = min(viewbox.scaleMax, viewbox.scale);
    viewbox.scale = viewbox.scale;

    viewbox.width = viewport.width / viewbox.scale;
    viewbox.height = viewport.height / viewbox.scale;

    return viewbox;
}