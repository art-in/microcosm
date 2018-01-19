import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';

import IdeaListItem from 'vm/shared/IdeaListItem';
import getRootPathForParent from 'action/utils/get-idea-parent-root-path';
import getRootPathVertices from 'utils/graph/get-root-path-vertices';
import getIdea from 'action/utils/get-idea';
import getRootPath from 'action/utils/get-idea-root-path';
import getIdeaColor from 'action/utils/get-idea-color';

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
    let rootPath = [];
    let predecessors = [];
    let successors = [];

    let parent;
    if (isNewIdea) {
        parent = getIdea(mindset, parentIdeaId);
    } else {
        const idea = getIdea(mindset, ideaId);
        if (idea !== mindset.root) {
            parent = idea.edgeFromParent.from;
        }
    }

    if (parent) {
        const rootPathIdeas = getRootPathVertices(mindset.root, parent);
        rootPath = rootPathIdeas.map(idea =>
            new IdeaListItem({
                id: idea.id,
                title: idea.title,
                tooltip: idea.title
            }));

        // move parent to the top of predecessors
        predecessors.push(
            new IdeaListItem({
                id: parent.id,
                title: parent.title,
                color: getIdeaColor(mindset, parent.id),
                tooltip: getRootPath(mindset, parent.id)
            }));
    }

    if (!isNewIdea) {
        
        // open existing idea
        const idea = getIdea(mindset, ideaId);
        
        title = idea.title || '';
        value = idea.value || '';

        if (mindset.root !== idea) {
            predecessors = predecessors.concat(idea.edgesIn
                // exclude parent as it was already added as predecessor
                .filter(a => a !== idea.edgeFromParent)
                .map(a => {
                    const predecessor = a.from;
                    return new IdeaListItem({
                        id: predecessor.id,
                        title: predecessor.title,
                        color: getIdeaColor(mindset, predecessor.id),
                        tooltip: getRootPath(mindset, predecessor.id)
                    });
                }));
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
            parentIdeaId: parentIdeaId || null,
            isNewIdea,

            title,
            value,
            rootPath,
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