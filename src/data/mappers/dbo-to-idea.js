import Idea from 'model/entities/Idea';

import dboToPoint from './dbo-to-point';

/**
 * Maps dbo to idea model
 * @param {object} dbo
 * @return {Idea}
 */
export default function dboToIdea(dbo) {
    const model = new Idea();

    model.id = dbo._id;
    model.mindmapId = dbo.mindmapId;
    model.isRoot = dbo.isRoot === true;
    model.value = dbo.value;
    model.color = dbo.color;
    model.pos = dboToPoint(dbo.pos);

    return model;
}