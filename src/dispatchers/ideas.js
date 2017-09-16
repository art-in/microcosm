import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';

import Patch from 'utils/state/Patch';

import Dispatcher from 'utils/state/Dispatcher';

const disp = new Dispatcher();

/**
 * Gets idea by ID
 *
 * @param {Mindmap} mindmap
 * @param {string} ideaId
 * @return {Idea}
 */
function getIdea(mindmap, ideaId) {

    const idea = mindmap.ideas.get(ideaId);

    if (!idea) {
        throw Error(`Idea with ID '${ideaId}' not found in mindmap`);
    }

    return idea;
}

/**
 * Creates idea
 *
 * @param {object} data
 * @param {string} data.parentIdeaId
 * @param {object} state
 * @return {Patch}
 */
disp.reg('create-idea',
    async ({parentIdeaId}, {model: {mindmap}}) => {

        const patch = new Patch();

        const newIdea = new Idea({
            mindmapId: mindmap.id,
            x: 0,
            y: 0
        });

        if (parentIdeaId) {

            const parentIdea = mindmap.ideas.get(parentIdeaId);

            if (!parentIdea) {
                throw Error(`Parent idea '${parentIdeaId}' not found`);
            }

            newIdea.x = parentIdea.x + 100;
            newIdea.y = parentIdea.y + 100;

            const assoc = new Association();
            
            assoc.mindmapId = mindmap.id;
            assoc.fromId = parentIdea.id;
            assoc.toId = newIdea.id;

            patch.push('add association', assoc);
        }

        patch.push('add idea', newIdea);

        return patch;
    });

/**
 * Removes idea with corresponding associations
 *
 * @param {object} data
 * @param {string} data.ideaId
 * @param {object} state
 * @return {Patch}
 */
disp.reg('remove-idea',
    async ({ideaId}, {model: {mindmap}}) => {

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
    });

/**
 * Sets value for idea
 *
 * @param {object} data
 * @param {string} data.ideaId
 * @param {string} data.value
 * @param {object} state
 * @return {Patch}
 */
disp.reg('set-idea-value',
    async ({ideaId, value}, {model: {mindmap}}) => {
        
        const idea = getIdea(mindmap, ideaId);

        if (idea.value != value) {
            return new Patch('update idea', {id: ideaId, value});
        }
    });

disp.reg('set-idea-position',
    async ({ideaId, pos}) => {

        return new Patch('update idea', {
            id: ideaId,
            x: pos.x,
            y: pos.y
        });
    });

disp.reg('set-idea-color',
    async ({ideaId, color}) => {

        return new Patch('update idea', {
            id: ideaId,
            color
        });
    });

export default disp;