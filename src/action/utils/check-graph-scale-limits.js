import assert from 'assert';
import required from 'utils/required-params';

/**
 * Checks whether graph scale limits allow to scale more up or down
 * 
 * @param {object} opts
 * @param {object} opts.viewbox - graph viewbox
 * @param {bool}   opts.up      - scale up or down
 * @return {bool}
 */
export default function checkGraphScaleLimits(opts) {
    const {viewbox, up} = required(opts);

    assert(viewbox.scale > 0, `Invalid scale '${viewbox.scale}'`);
    assert(viewbox.scaleMax > 0, `Invalid scale max '${viewbox.scaleMax }'`);
    assert(viewbox.scaleMin > 0, `Invalid scale min '${viewbox.scaleMin }'`);

    return (
        (up && viewbox.scale < viewbox.scaleMax) ||
        (!up && viewbox.scale > viewbox.scaleMin)
    );
}