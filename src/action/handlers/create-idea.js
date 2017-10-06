import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';

import Patch from 'utils/state/Patch';

/**
 * Creates idea
 *
 * @param {object} data
 * @param {object} state
 * @return {Patch}
 */
export default function createIdea(
    {parentIdeaId}, {model: {mindmap}}) {
    
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

        patch.push({
            type: 'add association',
            data: assoc
        });
    }

    patch.push({
        type: 'add idea',
        data: newIdea
    });

    return patch;
}