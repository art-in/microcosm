import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles go parent event from zen sidebar
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {
    sideEffects: {confirm},
    vm: {
      main: {
        mindset: {zen}
      }
    }
  } = state;

  const {parentIdeaId} = zen.sidebar;
  const {form} = zen.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  dispatch({type: 'zen-open-idea', data: {ideaId: parentIdeaId}});
}
