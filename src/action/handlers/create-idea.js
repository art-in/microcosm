import Patch from 'utils/state/Patch';
import getIdea from 'action/utils/get-idea';

import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';
import Point from 'model/entities/Point';

import weighAssociation from 'model/utils/weigh-association';

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
        pos: new Point({x: 0, y: 0})
    });

    if (parentIdeaId) {
        const parentIdea = getIdea(mindmap, parentIdeaId);

        idea.pos.x = parentIdea.pos.x + 100;
        idea.pos.y = parentIdea.pos.y + 100;

        const assoc = new Association();
        
        assoc.mindmapId = mindmap.id;
        assoc.fromId = parentIdea.id;
        assoc.toId = idea.id;

        assoc.weight = weighAssociation(parentIdea.pos, idea.pos);

        patch.push({
            type: 'add-association',
            data: {assoc}
        });
    }

    patch.push({
        type: 'add-idea',
        data: {idea}
    });

    return patch;
}