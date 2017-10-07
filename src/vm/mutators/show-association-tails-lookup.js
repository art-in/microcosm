import required from 'utils/required-params';

/**
 * Applies 'show-association-tails-lookup' mutation
 * 
 * @param {object}   state
 * @param {object}   data
 * @param {Point}    data.pos
 * @param {function} data.onSelectAction
 * @param {function} data.onPhraseChangeAction
*/
export default function showAssociationTailsLookup(state, data) {
    const {associationTailsLookup} = state.vm.main.mindmap.graph;
    const {pos, onSelectAction, onPhraseChangeAction} = required(data);

    associationTailsLookup.activate({
        pos,
        onSelectAction,
        onPhraseChangeAction
    });
}