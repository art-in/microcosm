import Patch from 'utils/state/Patch';
import view from 'vm/utils/view-mutation';

import StateType from 'boot/client/State';
import createId from 'utils/create-id';
import normalizePatch from 'action/utils/normalize-patch';

/**
 * Handles save event from idea form modal
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;

    const {form} = graph.ideaFormModal;

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
            type: 'animate-graph-viewbox-to-idea',
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
    

    patch.push(view('update-idea-form-modal', {
        form: {
            title,
            prev: {
                title,
                value: form.value
            },
            isEditingValue: false,
            isSaveable: false,
            isCancelable: false
        }
    }));

    return normalizePatch(patch);
}