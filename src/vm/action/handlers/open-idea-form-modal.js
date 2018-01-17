import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';

import IdeaListItem from 'vm/shared/IdeaListItem';
import getRootPathForParent from 'action/utils/get-idea-parent-root-path';
import getIdea from 'action/utils/get-idea';

/**
 * Opens idea form modal
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} [data.ideaId] - ID of existent idea
 * @param {string} [data.parentIdeaId] - ID of parent idea if creating new idea 
 * @param {boolean} [data.isNewIdea = false] - is creating new idea
 * @return {PatchType}
 */
export default function(state, data) {
    const {model: {mindset}} = state;
    const {ideaId, parentIdeaId, isNewIdea = false} = data;
    
    if (ideaId === undefined && !isNewIdea) {
        throw Error('Not received ID of existing idea to open');
    }

    if (isNewIdea && parentIdeaId === undefined) {
        throw Error('Not received ID of parent idea to create new idea for');
    }

    let title = '';
    let value = '';
    let successors = [];

    if (!isNewIdea) {
        
        // open existing idea
        const idea = getIdea(mindset, ideaId);
        
        title = idea.title || '';
        value = idea.value || '';

        // TODO: show incoming associations too (highlight parent)
        // TODO: move to 'idea-to-list-item' mapper
        successors = idea.edgesOut.map(a =>
            new IdeaListItem({
                id: a.to.id,
                title: a.to.title,
                rootPath: a.to.edgeFromParent === a ?
                    // do not show root path (parent and grandparents) of
                    // successor idea if this idea is its parent
                    null :
                    getRootPathForParent(mindset, a.to.id)
            }));
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
            successors,

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