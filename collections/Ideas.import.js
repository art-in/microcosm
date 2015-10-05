import { ideaToDbo as toDbo, dboToIdea as toModel } from 'mappers/ideaMapper';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

let col = new Mongo.Collection('ideas');

export function findOne(ideaId) {
  return toModel(col.findOne({_id: strToId(ideaId)}));
}

export function countCentral(exceptIdeaId) {
  let query = {isCentral: true};

  if (exceptIdeaId) {
    query._id = {$not: {$eq: strToId(exceptIdeaId)}};
  }

  return col.find(query).count();
}

export function reactivelyFetchAll(mindmapId) {
  let sub = Meteor.subscribe('ideas', mindmapId);

  if (!sub.ready()) {
    return {ideas: null};
  }

  return {
    ideas: col.find().fetch().map(toModel)
  };
}

export function insert(idea) {
  col.insert(toDbo(idea));
}

export function update(idea) {
  let dbo = toDbo(idea);
  col.update({_id: dbo._id}, dbo);
}

export function remove(ideaId) {
  col.remove({_id: strToId(ideaId)});
}

export function removeAll() {
  col.remove({});
}

export default {
  col,
  findOne,
  countCentral,
  reactivelyFetchAll,
  insert,
  update,
  remove,
  removeAll
}