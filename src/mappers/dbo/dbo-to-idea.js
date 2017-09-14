import Idea from 'domain/models/Idea';

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
    model.isCentral = dbo.isCentral === true;
    model.color = dbo.color;

    return model;
}