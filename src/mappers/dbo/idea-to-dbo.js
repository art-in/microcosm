import {deleteUndefinedProps} from 'lib/helpers/helpers';

/**
 * Maps idea model to dbo
 * @param {Idea|object} model - model or patch
 * @return {object}
 */
export default function ideaToDbo(model) {
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