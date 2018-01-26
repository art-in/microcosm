import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import setSuggestions from 'vm/shared/Lookup/methods/set-suggestions';
import toSuggestion from 'vm/mappers/idea-to-lookup-suggestion';
import searchSuccessors from 'action/utils/search-successors';

/**
 * Searches and sets suggesting ideas to lookup,
 * which selects tail idea for cross-association
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.phrase
 * @param {string} data.headIdeaId
 * @return {PatchType}
 */
export default function searchAssociationTailsForLookup(state, data) {
  const {model: {mindset}} = state;
  const {phrase, headIdeaId} = required(data);

  const ideas = searchSuccessors(mindset, {
    ideaId: headIdeaId,
    phrase
  });

  const suggestions = ideas.map(toSuggestion);

  return view('update-association-tails-lookup', {
    lookup: setSuggestions(suggestions)
  });
}
