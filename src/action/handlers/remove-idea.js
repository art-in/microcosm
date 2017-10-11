import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

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

    if (idea.isRoot) {
        throw Error('Unable to remove root idea');
    }

    patch.push({
        type: 'remove-idea',
        data: {id: ideaId}
    });

    if (idea.associationsOut.length) {
        throw Error(
            `Unable to remove idea '${idea.id}' ` +
            `with outgoing associations`);
    }

    const incomingAssocs = idea.associationsIn;

    if (!incomingAssocs.length) {
        throw Error(`No incoming associations found for idea '${idea.id}'`);
    }

    incomingAssocs.forEach(a => patch.push({
        type: 'remove-association',
        data: {id: a.id}
    }));

    return patch;
}