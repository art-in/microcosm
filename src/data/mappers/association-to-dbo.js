import deleteUndefinedProps from 'utils/delete-undefined-props';

/**
 * Maps a association model to dbo
 * @param {Association|object} model - model or patch
 * @return {object}
 */
export default function associationToDbo(model) {
    const dbo = {};

    dbo._id = model.id;
    dbo.mindmapId = model.mindmapId;
    dbo.fromId = model.fromId;
    dbo.toId = model.toId;
    dbo.value = model.value;
    dbo.weight = model.weight;

    deleteUndefinedProps(dbo);

    return dbo;
}