import deleteUndefinedProps from 'utils/delete-undefined-props';

/**
 * Maps mindmap model to dbo
 * @param {Mindmap|object} model - model or patch
 * @return {object}
 */
export default function mindmapToDbo(model) {
    const dbo = {};

    dbo._id = model.id;
    dbo.x = model.x;
    dbo.y = model.y;
    dbo.scale = model.scale;

    deleteUndefinedProps(dbo);

    return dbo;
}