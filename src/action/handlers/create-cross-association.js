import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import Association from 'model/entities/Association';

import getIdea from 'action/utils/get-idea';
import patchRootPaths from 'action/utils/patch-root-paths';
import normalizePatch from 'action/utils/normalize-patch';
import weighAssociation from 'model/utils/weigh-association';

/**
 * Creates association between two existing ideas
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.headIdeaId
 * @param {string} data.tailIdeaId
 * @return {Patch}
 */
export default function createCrossAssociation(state, data) {
    const {model: {mindset}} = state;
    const {headIdeaId, tailIdeaId} = required(data);

    const head = getIdea(mindset, headIdeaId);
    const tail = getIdea(mindset, tailIdeaId);

    // check integrity
    if (headIdeaId === tailIdeaId) {
        throw Error(`Unable to add self-association on idea '${headIdeaId}'`);
    }

    if (head.edgesOut.some(a => a.to === tail)) {
        throw Error(
            `Unable to create duplicate association ` +
            `between ideas '${headIdeaId}' and '${tailIdeaId}'`);
    }

    if (head.edgesIn.some(a => a.from === tail)) {
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
        mindsetId: mindset.id,
        fromId: headIdeaId,
        from: head,
        toId: tailIdeaId,
        to: tail,
        weight: weighAssociation(head.posAbs, tail.posAbs)
    });

    // bind to head
    const newHeadAssocsOut = head.edgesOut.concat([assoc]);

    patch.push('update-idea', {
        id: head.id,
        edgesOut: newHeadAssocsOut
    });

    // bind to tail
    patch.push('update-idea', {
        id: tail.id,
        edgesIn: tail.edgesIn.concat([assoc])
    });

    // add association
    patch.push('add-association', {assoc});

    // update root paths
    const rootPathsPatch = patchRootPaths({
        root: mindset.root,
        replaceEdgesOut: [{vertex: head, edgesOut: newHeadAssocsOut}]
    });

    patch = Patch.combine(patch, rootPathsPatch);

    return normalizePatch(patch);
}