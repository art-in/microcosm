import Mindmap from 'domain/models/Mindmap';
import {deleteUndefinedProps} from 'lib/helpers/helpers';

/**
 * Maps dbo to model
 * @param {object} dbo
 * @return {Mindmap}
 */
export function toModel(dbo) {
    const model = new Mindmap();

    model.id = dbo._id;
    model.x = dbo.x;
    model.y = dbo.y;
    model.scale = dbo.scale;
    
    return model;
}

/**
 * Maps model to dbo
 * @param {Mindmap|object} model - model or patch
 * @return {object}
 */
export function toDbo(model) {
    const dbo = {};

    dbo._id = model.id;
    dbo.x = model.x;
    dbo.y = model.y;
    dbo.scale = model.scale;

    deleteUndefinedProps(dbo);

    return dbo;
}