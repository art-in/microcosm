import Patch from 'utils/state/Patch';

import getIdea from 'action/utils/get-idea';

/**
 * Removes idea with corresponding associations
 *
 * @param {object} data
 * @param {object} state
 * @return {Patch}
 */
export default async function removeIdea(
    {ideaId}, {model: {mindmap}}) {
    
    const patch = new Patch();

    const idea = getIdea(mindmap, ideaId);

    if (idea.isRoot) {
        throw Error('Unable to remove root idea');
    }

    patch.push('remove idea', {id: ideaId});

    if (idea.associationsOut.length) {
        throw Error(
            `Unable to remove idea '${idea.id}' ` +
            `with outgoing associations`);
    }

    const incomingAssocs = idea.associationsIn;

    if (!incomingAssocs.length) {
        throw Error(`No incoming associations found for idea '${idea.id}'`);
    }

    incomingAssocs
        .forEach(a => patch.push('remove association', {id: a.id}));

    return patch;
}