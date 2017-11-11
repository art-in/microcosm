import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import getIdea from 'action/utils/get-idea';
import weighAssociation from 'model/utils/weigh-association';

import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';
import Point from 'model/entities/Point';

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
    const {parentIdeaId} = required(data);

    const patch = new Patch();

    const parent = getIdea(mindmap, parentIdeaId);

    const idea = new Idea({
        mindmapId: mindmap.id,
        pos: new Point({
            x: parent.pos.x + 100,
            y: parent.pos.y + 100
        })
    });

    // add association from parent to new idea
    const assoc = new Association({
        mindmapId: mindmap.id,
        fromId: parent.id,
        from: parent,
        toId: idea.id,
        to: idea,
        weight: weighAssociation(parent.pos, idea.pos)
    });

    // bind to parent
    patch.push('update-idea', {
        id: parent.id,
        associationsOut: parent.associationsOut.concat([assoc]),
        linksToChilds: parent.linksToChilds.concat([assoc])
    });

    // bind to new idea
    idea.associationsIn.push(assoc);
    idea.linkFromParent = assoc;
    idea.linksToChilds = [];

    // ensure parent idea RPW is valid
    if (!Number.isFinite(parent.rootPathWeight)) {
        throw Error(
            `Idea '${parent.id}' has invalid root path weight ` +
            `'${parent.rootPathWeight}'`);
    }
    
    idea.rootPathWeight = parent.rootPathWeight + assoc.weight;

    patch.push('add-association', {assoc});
    patch.push('add-idea', {idea});

    return patch;
}