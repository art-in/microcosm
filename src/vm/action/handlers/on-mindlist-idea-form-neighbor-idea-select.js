import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import openIdea from 'vm/list/entities/Mindlist/methods/open-idea';

import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm';

/**
 * Handles select heighbor idea event from mindlist idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 */
export default async function(state, data) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {list}}}} = state;
  const {ideaId} = required(data);

  const {form} = list.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  return view('update-mindlist', openIdea({mindset, ideaId}));
}
