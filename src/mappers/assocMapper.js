import Association from 'domain/models/Association';
import {deleteUndefinedProps} from 'lib/helpers/helpers';

/**
 * Maps dbo to model
 * @param {object} dbo
 * @return {Association}
 */
export function toModel(dbo) {
    const model = new Association();

    model.id = dbo._id;
    model.mindmapId = dbo.mindmapId;
    model.from = dbo.from;
    model.to = dbo.to;
    model.value = dbo.value;

    return model;
}

/**
 * Maps model to dbo
 * @param {Association|object} model - model or patch
 * @return {object}
 */
export function toDbo(model) {
    const dbo = {};

    dbo._id = model.id;
    dbo.mindmapId = model.mindmapId;
    dbo.from = model.from;
    dbo.to = model.to;
    dbo.value = model.value;

    deleteUndefinedProps(dbo);

    return dbo;
}