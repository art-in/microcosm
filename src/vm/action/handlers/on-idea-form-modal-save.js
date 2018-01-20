import Patch from 'utils/state/Patch';
import view from 'vm/utils/view-mutation';

import StateType from 'boot/client/State';
import createId from 'utils/create-id';
import normalizePatch from 'action/utils/normalize-patch';
import getIdea from 'action/utils/get-idea';
import diffArrays from 'utils/diff-arrays';

/**
 * Handles save event from idea form modal
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {model: {mindset}} = state;
    const {vm: {main: {mindset: {mindmap}}}} = state;

    const {form} = mindmap.ideaFormModal;

    if (!form.isSaveable) {
        // do not save if there was no changes
        return;
    }

    const patch = new Patch();

    const title = form.title.trim();

    if (form.isNewIdea) {

        // create new idea
        const ideaId = createId();

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

        // change form mode to existing idea
        patch.push(view('update-idea-form-modal', {
            form: {
                ideaId,
                parentIdeaId: null,
                isNewIdea: false
            }
        }));

    } else {

        // update existing idea
        dispatch({
            type: 'set-idea-title-and-value',
            data: {
                ideaId: form.ideaId,
                title,
                value: form.value
            }
        });
    }

    const idea = getIdea(mindset, form.ideaId);

    // update successors
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

    patch.push(view('update-idea-form-modal', {
        form: {
            title,
            prev: {
                title,
                value: form.value,
                successors: form.successors
            },
            isEditingValue: false,
            isSaveable: false,
            isCancelable: false
        }
    }));

    return normalizePatch(patch);
}