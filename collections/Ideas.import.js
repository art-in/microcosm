import { ideaToDbo as toDbo, dboToIdea as toIdea } from 'mappers/ideaMapper';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

let col = new Mongo.Collection('ideas');

export function findOne(ideaId) {
  return toIdea(col.findOne({_id: strToId(ideaId)}));
}

export function countCentral(exceptIdeaId) {
  let query = {isCentral: true};

  if (exceptIdeaId) {
    query._id = {$not: {$eq: strToId(exceptIdeaId)}};
  }

  return col.find(query).count();
}

export function fetchAll(mindmapId) {
  let sub = Meteor.subscribe('ideas', mindmapId);

  if (!sub.ready()) {
    return {ideas: null};
  }

  let ideas = col.find().fetch();
  return {
    ideas: ideas.map(toIdea)
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
  fetchAll,
  insert,
  update,
  remove,
  removeAll
}