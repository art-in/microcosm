import Assoc from 'models/Assoc';
import {idToStr, strToId} from 'server/lib/helpers/mongoHelpers';

export function toModel(dbo) {
    let model = new Assoc();

    model.id = idToStr(dbo._id);
    model.mindmapId = dbo.mindmapId;
    model.from = dbo.from;
    model.to = dbo.to;
    model.value = dbo.value;

    return model;
}

export function toDbo(model) {
    let dbo = {};

    dbo._id = strToId(model.id);
    dbo.mindmapId = model.mindmapId;
    dbo.from = model.from;
    dbo.to = model.to;
    dbo.value = model.value;

    return dbo;
}
