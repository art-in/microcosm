import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import viewPatch from 'vm/utils/view-patch';

import open from 'vm/shared/ImportFormModal/methods/open';
import getIdea from 'action/utils/get-idea';

/**
 * Handles import item select from mindset gear menu
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {model: {mindset}} = state;

  const focusIdea = getIdea(mindset, mindset.focusIdeaId);

  return viewPatch('update-mindset-vm', {
    importFormModal: open(focusIdea)
  });
}
