import required from 'utils/required-params';
import Patch from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';

import showLookup from 'vm/shared/Lookup/methods/show-lookup';

/**
 * Shows association tails lookup
 * which helps selecting tail idea for cross-association
 *
 * @param {StateType} state
 * @param {object}    data
 * @param {PointType} data.viewportPos - target viewport position for lookup
 * @param {string}    data.headIdeaId - ID of head idea
 * @return {Patch}
 */
export default function(state, data) {
  const {viewportPos, headIdeaId} = required(data);

  return Patch.combine(
    view('update-context-menu', {
      popup: {active: false}
    }),

    view('update-association-tails-lookup', {
      popup: {
        active: true,
        pos: viewportPos
      },
      lookup: {
        ...showLookup(),

        onPhraseChangeAction: ({phrase}) => ({
          type: 'search-association-tails-for-lookup',
          data: {
            headIdeaId,
            phrase
          }
        }),

        onSelectAction: ({suggestion}) => ({
          type: 'create-cross-association',
          data: {
            headIdeaId,
            tailIdeaId: suggestion.data.ideaId
          }
        })
      }
    })
  );
}
