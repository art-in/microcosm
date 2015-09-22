import Idea from 'models/Idea';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export function dboToIdea(dbo) {
  let model = new Idea();

  model.id = idToStr(dbo._id);
  model.x = dbo.x;
  model.y = dbo.y;
  model.value = dbo.value;
  model.isCentral = dbo.isCentral === true;

  return model;
}

export function ideaToDbo(model) {
  let dbo = {};

  dbo._id = strToId(model.id);
  dbo.x = model.x;
  dbo.y = model.y;
  dbo.value = model.value;
  if (model.isCentral) {
    dbo.isCentral = model.isCentral;
  }

  return dbo;
}

export default {
  dboToIdea,
  ideaToDbo
}