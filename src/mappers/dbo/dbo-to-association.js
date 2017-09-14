import Association from 'domain/models/Association';

/**
 * Maps dbo to association model
 * @param {object} dbo
 * @return {Association}
 */
export default function dboToAssociation(dbo) {
    const model = new Association();

    model.id = dbo._id;
    model.mindmapId = dbo.mindmapId;
    model.fromId = dbo.fromId;
    model.toId = dbo.toId;
    model.value = dbo.value;

    return model;
}