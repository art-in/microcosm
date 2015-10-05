import { assocToDbo as toDbo, dboToAssoc as toModel }
    from 'mappers/assocMapper';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

let col = new Mongo.Collection('assocs');

export function fetchAll() {
  return col.find().fetch().map(toModel);
}

export function reactivelyFetchAll(mindmapId) {
  let sub = Meteor.subscribe('assocs', mindmapId);

  if (!sub.ready()) {
    return {assocs: null};
  }

  return {
    assocs: col.find().fetch().map(toModel)
  };
}

export function countFrom(ideaId) {
  return col.find({from: ideaId}).count();
}

export function insert(assoc) {
  col.insert(toDbo(assoc));
}

export function update(assoc) {
  let dbo = toDbo(assoc);
  col.update({_id: dbo._id}, dbo);
}

export function remove(ideaId) {
  col.remove({$or: [{from: ideaId}, {to: ideaId}]});
}

export function removeAll() {
  col.remove({});
}

export default {
  col,
  fetchAll,
  reactivelyFetchAll,
  countFrom,
  insert,
  update,
  remove,
  removeAll
}