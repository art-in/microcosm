import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import getIdea from 'action/utils/get-idea';
import patchRootPaths from 'action/utils/patch-root-paths';
import normalizePatch from 'action/utils/normalize-patch';
import weighAssociation from 'model/utils/weigh-association';

import Association from 'model/entities/Association';

/**
 * Creates association between two existing ideas
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.headIdeaId
 * @param {string} data.tailIdeaId
 * @return {Patch}
 */
export default function createCrossAssociation(state, data) {
    const {model: {mindmap}} = state;
    const {headIdeaId, tailIdeaId} = required(data);

    const head = getIdea(mindmap, headIdeaId);
    const tail = getIdea(mindmap, tailIdeaId);

    // check integrity
    if (headIdeaId === tailIdeaId) {
        throw Error(`Unable to add self-association on idea '${headIdeaId}'`);
    }

    if (head.associationsOut.some(a => a.to === tail)) {
        throw Error(
            `Unable to create duplicate association ` +
            `between ideas '${headIdeaId}' and '${tailIdeaId}'`);
    }

    if (head.associationsIn.some(a => a.from === tail)) {
        throw Error(
            `Unable to create association from idea '${headIdeaId}' ` +
            `to its predecessor idea '${tailIdeaId}'`);
    }

    if (tail.isRoot) {
        throw Error(
            `Unable to create association from idea '${headIdeaId}' ` +
            `to root idea '${tailIdeaId}'`);
    }

    // add association
    let patch = new Patch();

    const assoc = new Association({
        mindmapId: mindmap.id,
        fromId: headIdeaId,
        from: head,
        toId: tailIdeaId,
        to: tail,
        weight: weighAssociation(head.posAbs, tail.posAbs)
    });

    // bind to head
    const newHeadAssocsOut = head.associationsOut.concat([assoc]);

    patch.push('update-idea', {
        id: head.id,
        associationsOut: newHeadAssocsOut
    });

    // bind to tail
    patch.push('update-idea', {
        id: tail.id,
        associationsIn: tail.associationsIn.concat([assoc])
    });

    // add association
    patch.push('add-association', {assoc});

    // update root paths
    const rootPathsPatch = patchRootPaths({
        root: mindmap.root,
        replaceEdgesOut: [{vertex: head, edgesOut: newHeadAssocsOut}]
    });

    patch = Patch.combine(patch, rootPathsPatch);

    return normalizePatch(patch);
}