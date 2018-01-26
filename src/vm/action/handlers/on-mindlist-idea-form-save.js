import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onSave from 'vm/shared/IdeaForm/methods/on-save';
import openIdea from 'vm/list/entities/Mindlist/methods/open-idea';

/**
 * Handles save event from mindlist idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {list}}}} = state;

  const {form} = list.pane;

  const ideaId = onSave(form, mindset, dispatch);

  if (ideaId) {
    // to simplify code, re-open form from scratch instead of smart updates on
    // existing form, so all fields correctly re-initialized (eg. when color
    // changed and saved, children in successor list should receive that color)
    return view(
      'update-mindlist',
      openIdea({
        mindset,
        ideaId
      })
    );
  }
}
