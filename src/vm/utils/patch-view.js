import assert from 'utils/assert';

import Patch from 'utils/state/Patch';

/**
 * Creates patch which targets only vm and view layers.
 * Allows to express view patches in less lines.
 * 
 * @example
 * // before
 * mutate(new Patch({
 *      type: 'update-graph',
 *      data: {viewbox},
 *      targets: ['vm', 'view']
 * }));
 * 
 * // after
 * mutate(view('update-graph', {viewbox}));
 * 
 * @param {string} mutationType
 * @param {object} [mutationData]
 * @return {Patch}
 */
export default function patchView(mutationType, mutationData) {
    assert(typeof mutationType === 'string');

    return new Patch({
        type: mutationType,
        data: mutationData,
        targets: ['vm', 'view']
    });
}