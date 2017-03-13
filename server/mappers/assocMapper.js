import Association from 'models/Association';
import {idToStr, strToId} from 'server/lib/helpers/mongoHelpers';

/**
 * Maps dbo to model
 * @param {object} dbo
 * @return {Association}
 */
export function toModel(dbo) {
    const model = new Association();

    model.id = idToStr(dbo._id);
    model.mindmapId = dbo.mindmapId;
    model.from = dbo.from;
    model.to = dbo.to;
    model.value = dbo.value;

    return model;
}

/**
 * Maps model to dbo
 * @param {Association} model
 * @return {object}
 */
export function toDbo(model) {
    const dbo = {};

    dbo._id = strToId(model.id);
    dbo.mindmapId = model.mindmapId;
    dbo.from = model.from;
    dbo.to = model.to;
    dbo.value = model.value;

    return dbo;
}