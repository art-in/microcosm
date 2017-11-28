import deleteUndefinedProps from 'utils/delete-undefined-props';

import MindmapType from 'model/entities/Mindmap';

import pointToDbo from './point-to-dbo';

/**
 * Maps mindmap model to dbo
 * @param {MindmapType|object} model - model or patch
 * @return {object}
 */
export default function mindmapToDbo(model) {
    const dbo = {};

    dbo._id = model.id;
    dbo.pos = model.pos && pointToDbo(model.pos);
    dbo.scale = model.scale;

    deleteUndefinedProps(dbo);

    return dbo;
}