import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import view from 'vm/utils/view-patch';

/**
 * Shows association tails lookup
 * which helps selecting tail idea for cross-association
 *
 * @param {object} state
 * @param {object} data
 * @param {Point}  data.pos - target canvas position for lookup
 * @param {string} data.headIdeaId - ID of head idea
 * @return {Patch}
 */
export default function(state, data) {
    const {pos, headIdeaId} = required(data);

    return Patch.combine([

        view('update-context-menu', {
            popup: {active: false}
        }),

        view('update-association-tails-lookup', {
            
            popup: {
                active: true,
                pos
            },
            lookup: {
                phrase: '',
                suggestions: [],
                activeSuggesionId: null,
                nothingFoundLabelShown: false,
                focused: true
            },
            onSelectAction: ({suggestion}) => ({
                type: 'on-association-tails-lookup-select',
                data: {
                    headIdeaId,
                    tailIdeaId: suggestion.data.ideaId
                }
            }),
            onPhraseChangeAction: ({phrase}) => ({
                type: 'search-association-tails-for-lookup',
                data: {
                    headIdeaId,
                    phrase
                }
            })
        })
    ]);
}