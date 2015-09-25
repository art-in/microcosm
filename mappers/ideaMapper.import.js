import Idea from 'models/Idea';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export function dboToIdea(dbo) {
  let model = new Idea();

  model.id = idToStr(dbo._id);
  model.mindmapId = dbo.mindmapId;
  model.x = dbo.x;
  model.y = dbo.y;
  model.value = dbo.value;
  model.isCentral = dbo.isCentral === true;
  model.color = dbo.color;

  return model;
}

export function ideaToDbo(model) {
  let dbo = {};

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

function deleteUndefinedProps(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop] === undefined) {
        delete obj[prop];
      }
    }
  }
}

export default {
  dboToIdea,
  ideaToDbo
}