import required from 'utils/required-params';
import view from 'vm/utils/view-mutation';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import LookupSuggestionType from 'vm/shared/LookupSuggestion';
import addSuccessor from 'vm/shared/IdeaForm/methods/add-successor';

/**
 * Handles suggestion select event from idea form successor lookup
 *
 * @param {StateType} state
 * @param {object} data
 * @param {LookupSuggestionType} data.suggestion
 * @return {Patch}
 */
export default function(state, data) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {zen}}}} = state;
  const {suggestion} = required(data);

  const {form} = zen.pane;

  const successorId = suggestion.data.ideaId;

  return new Patch([
    // add successor
    view('update-zen-pane', {
      form: addSuccessor(form, mindset, successorId)
    }),

    // hide popup
    view('update-zen-idea-form-successor-search-box', {
      active: false
    })
  ]);
}
