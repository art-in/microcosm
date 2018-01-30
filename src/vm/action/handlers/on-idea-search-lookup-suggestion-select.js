import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import LookupSuggestionType from 'vm/shared/LookupSuggestion';
import ViewMode from 'vm/main/MindsetViewMode';

/**
 * Handles suggestion select event from idea search lookup
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.headIdeaId
 * @param {string} data.tailIdeaId
 * @param {LookupSuggestionType} data.suggestion
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset}}} = state;
  const {suggestion} = required(data);

  const ideaId = suggestion.data.ideaId;

  switch (mindset.mode) {
    case ViewMode.mindmap:
      dispatch({
        type: 'open-idea-form-modal',
        data: {ideaId}
      });

      dispatch({
        type: 'animate-mindmap-viewbox-to-idea',
        data: {ideaId}
      });
      break;

    case ViewMode.zen:
      dispatch({type: 'zen-open-idea', data: {ideaId}});
      break;

    default:
      throw Error(`Unknown mindset view mode '${mindset.mode}'`);
  }

  // deactivate search box
  return view('update-idea-search-box', {active: false});
}
