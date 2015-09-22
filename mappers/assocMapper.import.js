import Assoc from 'models/Assoc';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export function dboToAssoc(dbo) {
  let model = new Assoc();

  model.id = idToStr(dbo._id);
  model.from = dbo.from;
  model.to = dbo.to;
  model.value = dbo.value;
  model.color = dbo.color;

  return model;
}

export function assocToDbo(model) {
  let dbo = {};

  dbo._id = strToId(model.id);
  dbo.from = model.from;
  dbo.to = model.to;
  dbo.value = model.value;
  dbo.color = model.color;

  return dbo;
}

export default {
  dboToAssoc,
  assocToDbo
};