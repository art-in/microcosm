import Assoc from 'models/Assoc';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export function dboToAssoc(dbo) {
  let model = new Assoc();

  model.id = idToStr(dbo._id);
  model.from = dbo.from;
  model.to = dbo.to;

  return model;
}

export function assocToDbo(model) {
  let dbo = {};

  dbo._id = new Mongo.ObjectID(model.id);
  dbo.from = model.from;
  dbo.to = model.to;

  return dbo;
}

export default {
  dboToAssoc,
  assocToDbo
};