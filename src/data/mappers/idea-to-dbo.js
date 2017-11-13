import deleteUndefinedProps from 'utils/delete-undefined-props';

import pointToDbo from './point-to-dbo';

/**
 * Maps idea model to dbo
 * @param {Idea|object} model - model or patch
 * @return {object}
 */
export default function ideaToDbo(model) {
    const dbo = {};

    dbo._id = model.id;
    dbo.mindmapId = model.mindmapId;
    dbo.isRoot = model.isRoot || undefined;
    dbo.value = model.value;
    dbo.color = model.color || undefined;
    dbo.posRel = model.posRel && pointToDbo(model.posRel);

    deleteUndefinedProps(dbo);

    return dbo;
}