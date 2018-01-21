import StateType from 'boot/client/State';
import createId from 'utils/create-id';
import getIdea from 'action/utils/get-idea';
import diffArrays from 'utils/diff-arrays';

/**
 * Handles save event from idea form modal
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {model: {mindset}} = state;
    const {vm: {main: {mindset: {mindmap}}}} = state;

    const {form} = mindmap.ideaFormModal;

    if (!form.isSaveable) {
        // do not save if there was no changes
        return;
    }

    const title = form.title.trim();
    let ideaId;

    if (form.isNewIdea) {

        // create new idea
        ideaId = createId();

        dispatch({
            type: 'create-idea',
            data: {
                parentIdeaId: form.parentIdeaId,
                title,
                value: form.value,
                ideaId
            }
        });

        dispatch({
            type: 'animate-mindmap-viewbox-to-idea',
            data: {ideaId}
        });

    } else {

        // save changes to existing idea
        ideaId = form.ideaId;

        dispatch({
            type: 'set-idea-title-and-value',
            data: {
                ideaId: form.ideaId,
                title,
                value: form.value
            }
        });
    }

    const idea = getIdea(mindset, ideaId);

    // save color
    dispatch({
        type: 'set-idea-color',
        data: {
            ideaId,
            color: form.color
        }
    });

    // save successors
    const oldSuccessorIds = idea.edgesOut.map(e => e.to.id);
    const newSuccessorIds = form.successors.map(i => i.id);

    const diff = diffArrays(oldSuccessorIds, newSuccessorIds);

    diff.add
        .forEach(successorId =>
            dispatch({
                type: 'create-cross-association',
                data: {
                    headIdeaId: idea.id,
                    tailIdeaId: successorId
                }
            }));

    diff.del
        .map(successorId =>
            // get ids of corresponding associations
            idea.edgesOut.find(a => a.to.id === successorId).id)
        .forEach(assocId =>
            dispatch({
                type: 'remove-association',
                data: {assocId}
            }));

    // to simplify code, re-open form from scratch instead of smart updates on
    // existing form, so all fields correctly re-initialized (eg. when color
    // changed and saved, children in successor list should receive that color)
    dispatch({
        type: 'open-idea-form-modal',
        data: {ideaId}
    });
}