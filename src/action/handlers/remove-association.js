import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import withoutItem from 'utils/get-array-without-item';
import patchRootPaths from 'action/utils/patch-root-paths';
import normalizePatch from 'action/utils/normalize-patch';
import getAssociation from 'action/utils/get-association';

/**
 * Removes association
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.assocId
 * @return {Patch}
 */
export default function(state, data) {
  const {model: {mindset}} = state;
  const {assocId} = required(data);

  let patch = new Patch();

  const assoc = getAssociation(mindset, assocId);

  const head = assoc.from;
  const tail = assoc.to;

  // check integrity
  if (!head) {
    throw Error(`Association '${assocId}' has no reference to head idea`);
  }

  if (!tail) {
    throw Error(`Association '${assocId}' has no reference to tail idea`);
  }

  if (tail.edgesIn.length === 1) {
    // hanging ideas are not allowed
    throw Error(
      `Association '${assocId}' cannot be removed ` +
        `because it is the last incoming association ` +
        `for idea '${assoc.to.id}'`
    );
  }

  // unbind from head
  let index = head.edgesOut.indexOf(assoc);

  if (index === -1) {
    throw Error(
      `Head idea '${head.id}' has no reference ` +
        `to outgoing association '${assocId}'`
    );
  }

  patch.push('update-idea', {
    id: head.id,
    edgesOut: withoutItem(head.edgesOut, index)
  });

  // unbind from tail
  index = tail.edgesIn.indexOf(assoc);

  if (index === -1) {
    throw Error(
      `Tail idea '${assoc.to.id}' has no reference ` +
        `to incoming association '${assocId}'`
    );
  }

  patch.push('update-idea', {
    id: tail.id,
    edgesIn: withoutItem(tail.edgesIn, index)
  });

  // remove association
  patch.push('remove-association', {id: assocId});

  // update root paths
  const rootPathsPatch = patchRootPaths({
    root: mindset.root,
    ignoreEdges: [assoc]
  });

  patch = Patch.combine(patch, rootPathsPatch);

  return normalizePatch(patch);
}
