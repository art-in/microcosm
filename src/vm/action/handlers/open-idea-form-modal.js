import view from 'vm/utils/view-patch';
import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';

import open from 'vm/shared/IdeaForm/methods/open';

/**
 * Opens idea form modal
 *
 * @param {StateType} state
 * @param {object} data
 * @param {boolean} [data.isNewIdea]
 * @param {string} [data.parentIdeaId]
 * @param {string} [data.ideaId]
 * @return {PatchType}
 */
export default function(state, data) {
  const {model: {mindset}} = state;
  const {ideaId, parentIdeaId, isNewIdea} = data;

  const form = open({
    mindset,
    isNewIdea,
    parentIdeaId,
    ideaId
  });

  return view('update-idea-form-modal', {
    modal: {active: true},
    form
  });
}
