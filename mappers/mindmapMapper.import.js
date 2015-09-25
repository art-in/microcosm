import Mindmap from 'models/Mindmap';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export function dboToMindmap(dbo, ideas, assocs) {
  let model = new Mindmap();

  model.id = idToStr(dbo._id);
  model.x = dbo.x;
  model.y = dbo.y;
  model.scale = dbo.scale;

  model.ideas = ideas;
  model.assocs = assocs;

  return model;
}

export function mindmapToDbo(model) {
  let dbo = {};

  dbo._id = strToId(model.id);
  dbo.x = model.x;
  dbo.y = model.y;
  dbo.scale = model.scale;

  return dbo;
}