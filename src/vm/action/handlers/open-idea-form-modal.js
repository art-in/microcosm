import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';

import IdeaListItem from 'vm/shared/IdeaListItem';
import getRootPathForParent from 'action/utils/get-idea-parent-root-path';
import getIdea from 'action/utils/get-idea';
import getRootPath from 'action/utils/get-idea-root-path';
import getIdeaColor from 'action/utils/get-idea-color';
import moveItem from 'utils/move-array-item';

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
    let predecessors = [];
    let successors = [];

    if (!isNewIdea) {
        
        // open existing idea
        const idea = getIdea(mindset, ideaId);
        
        title = idea.title || '';
        value = idea.value || '';

        // move parent association to the top
        let incomingAssocs = idea.edgesIn;
        const parrentAssocIdx = incomingAssocs.indexOf(idea.edgeFromParent);
        incomingAssocs = moveItem(incomingAssocs, parrentAssocIdx, 0);

        if (mindset.root !== idea) {
            predecessors = incomingAssocs.map(a => {
                const predecessor = a.from;
                return new IdeaListItem({
                    id: predecessor.id,
                    title: predecessor.title,
                    color: getIdeaColor(mindset, predecessor.id),
                    tooltip: getRootPath(mindset, predecessor.id)
                });
            });
        }

        successors = idea.edgesOut.map(a => {
            const successor = a.to;
            return new IdeaListItem({
                id: successor.id,
                title: successor.title,
                color: getIdeaColor(mindset, successor.id),
                tooltip: getRootPath(mindset, successor.id),
                rootPath: successor.edgeFromParent === a ?
                    // do not show root path (parent and grandparents) of
                    // successor idea if this idea is its parent
                    null :
                    getRootPathForParent(mindset, successor.id)
            });
        });
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
            predecessors,
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