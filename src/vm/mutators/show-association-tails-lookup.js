import assert from 'assert';

import Point from 'vm/shared/Point';

/**
 * Applies 'show-association-tails-lookup' mutation
 * 
 * @param {object}   state
 * @param {object}   mutation
 * @param {Point}    mutation.data.pos
 * @param {function} mutation.data.onSelectAction
 * @param {function} mutation.data.onPhraseChangeAction
*/
export default function showAssociationTailsLookup(state, mutation) {

    const {associationTailsLookup} = state.vm.main.mindmap.graph;
    const {pos, onSelectAction, onPhraseChangeAction} = mutation.data;

    assert(pos instanceof Point);
    assert(onSelectAction);
    assert(onPhraseChangeAction);

    associationTailsLookup.activate({
        pos,
        onSelectAction,
        onPhraseChangeAction
    });
}