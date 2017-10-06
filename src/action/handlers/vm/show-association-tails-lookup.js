import assert from 'assert';

import Patch from 'utils/state/Patch';

/**
 * Shows association tails lookup
 * which helps selecting tail idea for cross-association
 *
 * @param {object} data
 * @param {Point}  data.pos - target canvas position for lookup
 * @param {string} data.headIdeaId - ID of head idea
 * @return {Patch}
 */
export default function(
    {pos, headIdeaId}) {

    assert(pos !== undefined);
    assert(headIdeaId !== undefined);

    const patch = new Patch();

    // TODO: add ability to dispatch actions from another actions
    //       move hide-menu/show-lookup to separate action
    //      'select-menu-item-add-association'
    // TODO: Patch.push({...named params...})
    patch.push('hide-context-menu', null, ['vm', 'view']);

    // TODO: new Action()
    patch.push(
        'show-association-tails-lookup', {
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
        ['vm', 'view']);

    return patch;
}