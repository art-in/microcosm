import Patch from 'utils/state/Patch';

import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';

/**
 * Creates idea
 *
 * @param {object} state
 * @param {object} data
 * @param {string} [data.parentIdeaId]
 * @return {Patch}
 */
export default function createIdea(state, data) {
    const {model: {mindmap}} = state;
    const {parentIdeaId} = data;

    const patch = new Patch();

    const idea = new Idea({
        mindmapId: mindmap.id,
        x: 0,
        y: 0
    });

    if (parentIdeaId) {
        // TODO: use get idea util
        const parentIdea = mindmap.ideas.get(parentIdeaId);

        if (!parentIdea) {
            throw Error(`Parent idea '${parentIdeaId}' not found`);
        }

        idea.x = parentIdea.x + 100;
        idea.y = parentIdea.y + 100;

        const assoc = new Association();
        
        assoc.mindmapId = mindmap.id;
        assoc.fromId = parentIdea.id;
        assoc.toId = idea.id;

        patch.push({
            type: 'add association',
            data: {assoc}
        });
    }

    patch.push({
        type: 'add idea',
        data: {idea}
    });

    return patch;
}