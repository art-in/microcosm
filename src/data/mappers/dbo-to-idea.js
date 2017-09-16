import Idea from 'model/entities/Idea';

/**
 * Maps dbo to idea model
 * @param {object} dbo
 * @return {Idea}
 */
export default function dboToIdea(dbo) {
    const model = new Idea();

    model.id = dbo._id;
    model.mindmapId = dbo.mindmapId;
    model.x = dbo.x;
    model.y = dbo.y;
    model.value = dbo.value;
    model.isRoot = dbo.isRoot === true;
    model.color = dbo.color;

    return model;
}