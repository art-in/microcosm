import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import openIdea from 'vm/list/entities/Mindlist/methods/open-idea';
import viewPatch from 'vm/utils/view-patch';
import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles go parent event from mindlist sidebar
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {list}}}} = state;

  const {parentIdeaId} = list.sidebar;
  const {form} = list.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  return viewPatch(
    'update-mindlist',
    openIdea({mindset, ideaId: parentIdeaId})
  );
}
