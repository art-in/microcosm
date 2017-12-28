import Mindset from 'model/entities/Mindset';

import dboToPoint from './dbo-to-point';

/**
 * Maps dbo to mindset model
 * @param {object} dbo
 * @return {Mindset}
 */
export default function dboToMindset(dbo) {
    const model = new Mindset();

    model.id = dbo._id;
    model.pos = dboToPoint(dbo.pos);
    model.scale = dbo.scale;
    
    return model;
}