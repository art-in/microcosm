import Patch from 'utils/state/Patch';

/**
 * Creates patch which targets only vm and view layers.
 * Allows to express view patches in less lines.
 *
 * @example
 * // before
 * return new Patch({
 *      type: 'update-mindmap',
 *      data: {viewbox},
 *      targets: ['vm', 'view']
 * });
 *
 * // after
 * return view('update-mindmap', {viewbox});
 *
 * @param {string} mutationType
 * @param {object} [mutationData]
 * @return {Patch}
 */
export default function viewPatch(mutationType, mutationData) {
  return new Patch({
    type: mutationType,
    data: mutationData,
    targets: ['vm', 'view']
  });
}
