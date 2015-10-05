import { mindmapToDbo as toDbo, dboToMindmap as toModel }
  from 'mappers/mindmapMapper';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

let col = new Mongo.Collection('mindmaps');

export function reactivelyFetchAll() {
  let sub = Meteor.subscribe('mindmaps');

  if (!sub.ready()) {
    return {mindmaps: null};
  }

  return {
    mindmaps: col.find().fetch().map(toModel)
  };
}

export function findOne(mindmapId) {
  let query = {};
  if (mindmapId) {
    query._id = strToId(mindmapId);
  }

  return toModel(col.findOne(query));
}

export function insert(mindmap) {
  col.insert(toDbo(mindmap));
}

export function update(mindmap) {
  let dbo = toDbo(mindmap);
  col.update({_id: dbo._id}, dbo);
}

export function removeAll() {
  col.remove({});
}

export default {
  col,
  reactivelyFetchAll,
  findOne,
  insert,
  update,
  removeAll
}