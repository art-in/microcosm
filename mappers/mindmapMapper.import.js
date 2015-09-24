import Mindmap from 'models/Mindmap';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export function dboToMindmap(dbo) {
  let model = new Mindmap();

  model.id = idToStr(dbo._id);
  model.viewbox = dbo.viewbox;

  return model;
}

export function mindmapToDbo(model) {
  let dbo = {};

  dbo._id = strToId(model.id);
  dbo.viewbox = model.viewbox;

  return dbo;
}