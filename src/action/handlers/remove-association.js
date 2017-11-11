import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import withoutItem from 'utils/get-array-without-item';
import getRootPathsPatch from 'action/utils/get-root-paths-patch';
import normalizePatch from 'action/utils/normalize-patch';
import getAssociation from 'action/utils/get-association';

/**
 * Removes association
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.assocId
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {model: {mindmap}} = state;
    const {assocId} = required(data);
    
    let patch = new Patch();
    
    const assoc = getAssociation(mindmap, assocId);

    const head = assoc.from;
    const tail = assoc.to;

    // check integrity
    if (!head) {
        throw Error(`Association '${assocId}' has no reference to head idea`);
    }

    if (!tail) {
        throw Error(`Association '${assocId}' has no reference to tail idea`);
    }

    if (tail.associationsIn.length === 1) {
        // hanging ideas are not allowed
        throw Error(
            `Association '${assocId}' cannot be removed ` +
            `because it is the last incoming association ` +
            `for idea '${assoc.to.id}'`);
    }

    // unbind from head
    let index = head.associationsOut.indexOf(assoc);

    if (index === -1) {
        throw Error(
            `Head idea '${head.id}' has no reference ` +
            `to outgoing association '${assocId}'`);
    }

    patch.push('update-idea', {
        id: head.id,
        associationsOut: withoutItem(head.associationsOut, index)
    });

    // unbind from tail
    index = tail.associationsIn.indexOf(assoc);

    if (index === -1) {
        throw Error(
            `Tail idea '${assoc.to.id}' has no reference ` +
            `to incoming association '${assocId}'`);
    }

    patch.push('update-idea', {
        id: tail.id,
        associationsIn: withoutItem(tail.associationsIn, index)
    });

    // remove association
    patch.push('remove-association', {id: assocId});

    // update root paths
    const rootPathsPatch = getRootPathsPatch({
        root: mindmap.root,
        ignoreLinks: [assoc]
    });

    patch = Patch.combine(patch, rootPathsPatch);
    
    return normalizePatch(patch);
}