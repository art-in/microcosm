import view from 'vm/utils/view-patch';
import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';

import open from 'vm/shared/IdeaForm/methods/open';

/**
 * Opens new or existing idea in mindmap mode
 *
 * @param {StateType} state
 * @param {object} data
 * @param {boolean} [data.isNewIdea]
 * @param {string} [data.parentIdeaId]
 * @param {string} [data.ideaId]
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
  const {model: {mindset}} = state;
  const {ideaId, parentIdeaId, isNewIdea} = data;

  if (!isNewIdea) {
    dispatch({type: 'set-mindset-focus-idea', data: {ideaId}});
  }

  return view('update-idea-form-modal', {
    modal: {active: true},
    form: open({
      mindset,
      isNewIdea,
      parentIdeaId,
      ideaId
    })
  });
}
