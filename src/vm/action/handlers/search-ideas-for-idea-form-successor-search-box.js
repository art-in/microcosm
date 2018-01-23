import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import setSuggestions from 'vm/shared/Lookup/methods/set-suggestions';
import toSuggestion from 'vm/map/mappers/idea-to-lookup-suggestion';
import searchSuccessors from 'action/utils/search-successors';

/**
 * Searches and sets suggesting ideas to successor lookup of idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.phrase
 * @return {PatchType}
 */
export default function(state, data) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {mindmap: {ideaFormModal: {form}}}}}} = state;
  const {phrase} = required(data);

  const ideas = searchSuccessors(mindset, {
    ideaId: form.ideaId,
    phrase
  });

  const suggestions = ideas.map(toSuggestion);

  return view('update-idea-form-successor-search-box', {
    lookup: setSuggestions(suggestions)
  });
}
