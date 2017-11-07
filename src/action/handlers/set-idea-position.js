import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import getDescendants from 'utils/graph/get-descendants';
import getIdea from 'action/utils/get-idea';
import weighAssociation from 'model/utils/weigh-association';
import isValidPosition from 'model/utils/is-valid-position';

/**
 * Sets position of idea and its child-subtree
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {Point}  data.pos
 * @return {Patch}
 */
export default function setIdeaPosition(state, data) {
    const {model: {mindmap}} = state;
    const {ideaId, pos} = required(data);

    const patch = new Patch();

    const idea = getIdea(mindmap, ideaId);

    // position delta
    const dx = pos.x - idea.pos.x;
    const dy = pos.y - idea.pos.y;

    // move entire child-subtree with parent idea
    const descendants = getDescendants(idea);
    const movedIdeas = [idea, ...descendants];

    movedIdeas.forEach(idea => {

        if (!isValidPosition(idea.pos)) {
            throw Error(`Idea '${idea.id}' has invalid position '${idea.pos}'`);
        }

        const newPos = {
            x: idea.pos.x + dx,
            y: idea.pos.y + dy
        };

        // re-weigh all related associations
        const assocWeights = [];
        idea.associationsIn.forEach(assoc => {
            if (movedIdeas.includes(assoc.from)) {
                // do not update weight of associations between moved ideas.
                // they cannot change since relative position between ideas
                // is not changing.
                return;
            }

            assocWeights.push({
                id: assoc.id,
                weight: weighAssociation(assoc.from.pos, newPos)
            });
        });
    
        idea.associationsOut.forEach(assoc => {
            if (movedIdeas.includes(assoc.to)) {
                return;
            }

            assocWeights.push({
                id: assoc.id,
                weight: weighAssociation(newPos, assoc.to.pos)
            });
        });

        assocWeights.forEach(w => patch.push({
            type: 'update-association',
            data: {
                id: w.id,
                weight: w.weight
            }
        }));

        // update idea
        patch.push({
            type: 'update-idea',
            data: {
                id: idea.id,
                pos: newPos
            }
        });

    });

    return patch;
}