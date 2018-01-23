import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import searchIdeas from 'action/utils/search-ideas';

import setSuggestions from 'vm/shared/Lookup/methods/set-suggestions';
import toSuggestion from 'vm/map/mappers/idea-to-lookup-suggestion';

/**
 * Searches and sets suggesting ideas to idea search box lookup
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.phrase
 * @return {PatchType}
 */
export default function(state, data) {
  const {model: {mindset}} = state;
  const {phrase} = required(data);

  const ideas = searchIdeas(mindset, {phrase});
  const suggestions = ideas.map(toSuggestion);

  return view('update-idea-search-box', {
    lookup: setSuggestions(suggestions)
  });
}
