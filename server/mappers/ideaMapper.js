import Idea from 'models/Idea';
import {idToStr, strToId} from 'server/lib/helpers/mongoHelpers';

/**
 * Maps dbo to model
 * @param {object} dbo
 * @return {Idea}
 */
export function toModel(dbo) {
    const model = new Idea();

    model.id = idToStr(dbo._id);
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
 * @param {Idea} model
 * @return {object}
 */
export function toDbo(model) {
    const dbo = {};

    dbo._id = strToId(model.id);
    dbo.mindmapId = model.mindmapId;
    dbo.x = model.x;
    dbo.y = model.y;
    dbo.value = model.value;
    dbo.isCentral = model.isCentral || undefined;
    dbo.color = model.color || undefined;

    deleteUndefinedProps(dbo);
    return dbo;
}

/**
 * Deletes props with undefined values from object
 * @param {object} obj
 */
function deleteUndefinedProps(obj) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === undefined) {
                delete obj[prop];
            }
        }
    }
}