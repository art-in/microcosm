import view from 'vm/utils/view-patch';
import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';
import getRootPathVertices from 'utils/graph/get-root-path-vertices';
import getIdea from 'action/utils/get-idea';
import toListItem from 'vm/map/mappers/idea-to-list-item';

import IdeaListItem from 'vm/shared/IdeaListItem';

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
    let color = '';
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
        predecessors.push(toListItem(mindset, parent));
    }

    if (!isNewIdea) {
        
        // open existing idea
        const idea = getIdea(mindset, ideaId);
        
        // default to empty string so mutator wont warn on type mismatch
        // (ie. mutation from string to undefined)
        title = idea.title || '';
        value = idea.value || '';
        color = idea.color || '';

        if (mindset.root !== idea) {
            predecessors = predecessors.concat(idea.edgesIn
                // exclude parent as it was already added as predecessor
                .filter(a => a !== idea.edgeFromParent)
                .map(a => a.from)
                .map(toListItem.bind(null, mindset)));
        }

        successors = idea.edgesOut
            .map(a => a.to)
            .map(toListItem.bind(null, mindset));

        successors.forEach(s => {
            const successor = idea.edgesOut.find(a => a.to.id === s.id).to;
            
            // prevent removing last incoming association from successor
            s.isRemovable = successor.edgesIn.length !== 1;

            // do not show root path (parent and grandparents) of
            // successor idea if this idea is its parent
            s.rootPath = successor.edgeFromParent.from === idea ?
                null : s.rootPath;
        });
    }

    return view('update-idea-form-modal', {
        modal: {
            active: true
        },
        form: {
            ideaId: ideaId || null,
            parentIdeaId: parentIdeaId || null,
            isNewIdea,

            title,
            value,
            color,

            rootPath,
            predecessors,
            successors,

            prev: {
                title,
                value,
                color,
                successors
            },

            isTitleValid: !isNewIdea,
            shouldFocusTitleOnShow: isNewIdea,
            isEditingValue: isNewIdea,
            isGearMenuAvailable: !isNewIdea,
            isGearMenuExpanded: false,
            isSuccessorsEditable: !isNewIdea,
            isSaveable: false,
            isCancelable: false
        }
    });
}