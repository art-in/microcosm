import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import withoutItem from 'utils/get-array-without-item';
import normalizePatch from 'action/utils/normalize-patch';
import getIdea from 'action/utils/get-idea';

/**
 * Removes idea with corresponding associations
 *
 * @param {object} state
 * @param {object} data
 * @param {object} data.ideaId
 * @return {Patch}
 */
export default function removeIdea(state, data) {
    const {model: {mindmap}} = state;
    const {ideaId} = required(data);

    const patch = new Patch();

    const idea = getIdea(mindmap, ideaId);

    // check integrity
    if (idea.isRoot) {
        throw Error('Unable to remove root idea');
    }

    if (idea.associationsOut.length) {
        throw Error(
            `Unable to remove idea '${idea.id}' with outgoing associations`);
    }

    if (!idea.associationsIn || !idea.associationsIn.length) {
        // hanging ideas are not allowed
        throw Error(`No incoming associations found for idea '${idea.id}'`);
    }

    // remove incoming associations
    idea.associationsIn.forEach(assoc => {

        // unbind from head
        const head = assoc.from;
    
        if (!head) {
            throw Error(
                `Association '${assoc.id}' has no reference to head idea`);
        }
    
        const index = head.associationsOut.indexOf(assoc);
    
        if (index === -1) {
            throw Error(
                `Head idea '${head.id}' has no reference ` +
                `to outgoing association '${assoc.id}'`);
        }
    
        patch.push('update-idea', {
            id: head.id,
            associationsOut: withoutItem(head.associationsOut, index)
        });

        // remove association
        patch.push('remove-association', {id: assoc.id});
    });

    patch.push('remove-idea', {id: ideaId});

    // update root paths.
    // since removing idea with outgoing associations is not allowed,
    // it cannot affect root paths of any other idea, so we do not need to 
    // recalculate root paths for entire graph.
    // removing parent-child link is enough.
    const parent = idea.linkFromParent.from;
    const index = parent.linksToChilds.indexOf(idea.linkFromParent);

    patch.push('update-idea', {
        id: parent.id,
        linksToChilds: withoutItem(parent.linksToChilds, index)
    });

    return normalizePatch(patch);
}