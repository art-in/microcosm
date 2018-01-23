import Mutation from 'utils/state/Mutation';

/**
 * Creates mutation which targets only vm and view layers.
 * Allows to express view mutations in less lines.
 *
 * @example
 * // before
 * const patch = new Patch();
 * patch.push({
 *      type: 'update-mindmap',
 *      data: {viewbox},
 *      targets: ['vm', 'view']
 * });
 *
 * // after
 * const patch = new Patch();
 * patch.push(view('update-mindmap', {viewbox}))
 *
 * @param {string} mutationType
 * @param {object} [mutationData]
 * @return {Mutation}
 */
export default function viewMutation(mutationType, mutationData) {
  return new Mutation({
    type: mutationType,
    data: mutationData,
    targets: ['vm', 'view']
  });
}
