import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import getDescendants from 'utils/graph/get-descendants';
import weighAssociation from 'model/utils/weigh-association';
import isValidPosition from 'model/utils/is-valid-position';
import getRootPathsPatch from 'action/utils/get-root-paths-patch';
import normalizePatch from 'action/utils/normalize-patch';
import getIdea from 'action/utils/get-idea';

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

    let patch = new Patch();

    const idea = getIdea(mindmap, ideaId);

    // position delta
    const dx = pos.x - idea.pos.x;
    const dy = pos.y - idea.pos.y;

    if (dx === 0 && dy === 0) {
        // position was not changed
        return;
    }

    // move entire child-subtree with parent idea
    const descendants = getDescendants(idea);
    const movedIdeas = [idea, ...descendants];

    const assocWeights = [];

    movedIdeas.forEach(idea => {

        if (!isValidPosition(idea.pos)) {
            throw Error(`Idea '${idea.id}' has invalid position '${idea.pos}'`);
        }

        const newPos = {
            x: idea.pos.x + dx,
            y: idea.pos.y + dy
        };

        // re-weigh all related associations
        idea.associationsIn.forEach(assoc => {
            if (movedIdeas.includes(assoc.from)) {
                // do not update weight of associations between moved ideas.
                // they cannot change since relative position between ideas
                // is not changing.
                return;
            }

            assocWeights.push({
                assoc,
                weight: weighAssociation(assoc.from.pos, newPos)
            });
        });
    
        idea.associationsOut.forEach(assoc => {
            if (movedIdeas.includes(assoc.to)) {
                return;
            }

            assocWeights.push({
                assoc,
                weight: weighAssociation(newPos, assoc.to.pos)
            });
        });

        // update idea
        patch.push('update-idea', {
            id: idea.id,
            pos: newPos
        });
    });

    assocWeights.forEach(w =>
        patch.push('update-association', {
            id: w.assoc.id,
            weight: w.weight
        }));

    // update root paths
    const rootPathsPatch = getRootPathsPatch({
        root: mindmap.root,
        replaceLinkWeights: assocWeights.map(aw => ({
            link: aw.assoc,
            weight: aw.weight
        }))
    });

    patch = Patch.combine(patch, rootPathsPatch);
    
    return normalizePatch(patch);
}