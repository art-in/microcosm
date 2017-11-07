import Mindmap from 'model/entities/Mindmap';

import dboToPoint from './dbo-to-point';

/**
 * Maps dbo to mindmap model
 * @param {object} dbo
 * @return {Mindmap}
 */
export default function dboToMindmap(dbo) {
    const model = new Mindmap();

    model.id = dbo._id;
    model.pos = dboToPoint(dbo.pos);
    model.scale = dbo.scale;
    
    return model;
}