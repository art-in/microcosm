import Mindmap from 'domain/models/Mindmap';

/**
 * Maps dbo to mindmap model
 * @param {object} dbo
 * @return {Mindmap}
 */
export default function dboToMindmap(dbo) {
    const model = new Mindmap();

    model.id = dbo._id;
    model.x = dbo.x;
    model.y = dbo.y;
    model.scale = dbo.scale;
    
    return model;
}