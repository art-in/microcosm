import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import isValidPathWeight from 'utils/graph/is-valid-path-weight';

import getIdea from 'action/utils/get-idea';
import weighAssociation from 'model/utils/weigh-association';

import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';
import Point from 'model/entities/Point';

/**
 * Creates idea
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.parentIdeaId
 * @return {Patch}
 */
export default function createIdea(state, data) {
    const {model: {mindmap}} = state;
    const {parentIdeaId} = required(data);

    const patch = new Patch();

    const parent = getIdea(mindmap, parentIdeaId);

    const posRel = new Point({
        x: 100,
        y: 100
    });

    const idea = new Idea({
        mindmapId: mindmap.id,
        posRel,
        posAbs: new Point({
            x: parent.posAbs.x + posRel.x,
            y: parent.posAbs.y + posRel.y
        })
    });

    // add association from parent to new idea
    const assoc = new Association({
        mindmapId: mindmap.id,
        fromId: parent.id,
        from: parent,
        toId: idea.id,
        to: idea,
        // @ts-ignore
        weight: weighAssociation(parent.posAbs, idea.posAbs)
    });

    // bind to parent
    patch.push('update-idea', {
        id: parent.id,
        edgesOut: parent.edgesOut.concat([assoc]),
        edgesToChilds: parent.edgesToChilds.concat([assoc])
    });

    // bind to new idea
    idea.edgesIn.push(assoc);
    idea.edgeFromParent = assoc;
    idea.edgesToChilds = [];

    // ensure parent idea RPW is valid
    if (!isValidPathWeight(parent.rootPathWeight)) {
        throw Error(
            `Idea '${parent.id}' has invalid root path weight ` +
            `'${parent.rootPathWeight}'`);
    }
    
    idea.rootPathWeight = parent.rootPathWeight + assoc.weight;

    patch.push('add-association', {assoc});
    patch.push('add-idea', {idea});

    return patch;
}