import assert from 'utils/assert';
import isValidScale from 'model/utils/is-valid-scale';

/**
 * Checks whether graph scale limits allow to scale more up or down
 * 
 * @param {object} opts
 * @param {object} opts.viewbox - graph viewbox
 * @param {boolean}   opts.up      - scale up or down
 * @return {boolean}
 */
export default function checkGraphScaleLimits(opts) {
    const {viewbox, up} = opts;

    const {scale, scaleMin, scaleMax} = viewbox;

    assert(isValidScale(scale), `Invalid scale '${viewbox.scale}'`);
    assert(isValidScale(scaleMin), `Invalid scale min '${viewbox.scaleMin }'`);
    assert(isValidScale(scaleMax), `Invalid scale max '${viewbox.scaleMax }'`);

    return (
        (up && scale < scaleMax) ||
        (!up && scale > scaleMin)
    );
}