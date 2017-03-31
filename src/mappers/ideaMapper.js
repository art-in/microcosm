import Idea from 'domain/models/Idea';
import {deleteUndefinedProps} from 'lib/helpers/helpers';

/**
 * Maps dbo to model
 * @param {object} dbo
 * @return {Idea}
 */
export function toModel(dbo) {
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

/**
 * Maps model to dbo
 * @param {Idea|object} model - model or patch
 * @return {object}
 */
export function toDbo(model) {
    const dbo = {};

    dbo._id = model.id;
    dbo.mindmapId = model.mindmapId;
    dbo.x = model.x;
    dbo.y = model.y;
    dbo.value = model.value;
    dbo.isCentral = model.isCentral || undefined;
    dbo.color = model.color || undefined;

    deleteUndefinedProps(dbo);
    
    return dbo;
}