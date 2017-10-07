import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

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

    const patch = new Patch();

    // TODO: add ability to dispatch actions from another actions
    //       move hide-menu/show-lookup to separate action
    //      'select-menu-item-add-association'
    patch.push({
        type: 'hide-context-menu',
        targets: ['vm', 'view']
    });

    patch.push({
        type: 'show-association-tails-lookup',
        data: {
            pos,
            onSelectAction: ({suggestion}) => ({
                type: 'create-cross-association',
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
        },
        targets: ['vm', 'view']
    });

    return patch;
}