import view from 'vm/utils/view-patch';

import PatchType from 'utils/state/Patch';

/**
 * Opens idea form modal
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} [data.ideaId] - ID of existent idea
 * @param {string} [data.parentIdeaId] - ID of parent idea if creating new idea 
 * @param {boolean} [data.isNewIdea = false] - is creating new idea
 * @return {PatchType}
 */
export default function(state, data) {
    const {model: {mindmap}} = state;
    const {ideaId, parentIdeaId, isNewIdea = false} = data;
    
    if (ideaId === undefined && !isNewIdea) {
        throw Error('Not received ID of existing idea to open');
    }

    if (isNewIdea && parentIdeaId === undefined) {
        throw Error('Not received ID of parent idea to create new idea for');
    }

    let title = '';
    let value = '';

    if (!isNewIdea) {
        
        // open existing idea
        const idea = mindmap.ideas.get(ideaId);
        
        title = idea.title || '';
        value = idea.value || '';
    }

    return view('update-idea-form-modal', {
        modal: {
            active: true
        },
        form: {
            ideaId,
            parentIdeaId,
            isNewIdea,

            title,
            value,
            prev: {
                title,
                value
            },
            isTitleValid: true,
            shouldFocusTitleOnShow: isNewIdea,
            isEditingValue: isNewIdea,
            isSaveable: false,
            isCancelable: false
        }
    });
}