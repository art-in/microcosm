import required from 'utils/required-params';
import Association from 'model/entities/Association';

import Patch from 'utils/state/Patch';

import weighAssociation from 'model/utils/weigh-association';

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

    // check integrity

    const head = mindmap.ideas.get(headIdeaId);
    if (!head) {
        throw Error(
            `Head idea '${headIdeaId}' was not found for cross-association`);
    }

    const tail = mindmap.ideas.get(tailIdeaId);
    if (!tail) {
        throw Error(
            `Tail idea '${tailIdeaId}' was not found for cross-association`);
    }

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
            `to its parent idea '${tailIdeaId}'`);
    }

    if (tail.isRoot) {
        throw Error(
            `Unable to create association from idea '${headIdeaId}' ` +
            `to root idea '${tailIdeaId}'`);
    }

    // add association

    const assoc = new Association();
    
    assoc.mindmapId = mindmap.id;
    assoc.fromId = headIdeaId;
    assoc.toId = tailIdeaId;

    assoc.weight = weighAssociation(head.pos, tail.pos);

    return new Patch({
        type: 'add-association',
        data: {assoc}
    });
}