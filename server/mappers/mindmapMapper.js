import Mindmap from 'models/Mindmap';
import {idToStr, strToId} from 'server/lib/helpers/mongoHelpers';

/**
 * Maps dbo to model
 * @param {object} dbo
 * @return {Mindmap}
 */
export function toModel(dbo) {
    const model = new Mindmap();

    model.id = idToStr(dbo._id);
    model.x = dbo.x;
    model.y = dbo.y;
    model.scale = dbo.scale;

    return model;
}

/**
 * Maps model to dbo
 * @param {Mindmap} model
 * @return {object}
 */
export function toDbo(model) {
    const dbo = {};

    dbo._id = strToId(model.id);
    dbo.x = model.x;
    dbo.y = model.y;
    dbo.scale = model.scale;

    return dbo;
}