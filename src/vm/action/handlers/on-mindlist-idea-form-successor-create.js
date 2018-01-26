import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm';
import openIdea from 'vm/list/entities/Mindlist/methods/open-idea';

/**
 * Handles successor create event from mindlist idea form
 *
 * @param {StateType} state
 */
export default function(state) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {list}}}} = state;

  const {form} = list.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  return view(
    'update-mindlist',
    openIdea({
      mindset,
      isNewIdea: true,
      parentIdeaId: form.ideaId
    })
  );
}
