import Idea from 'models/Idea';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export function dboToIdea(ideaDbo) {
  let idea = new Idea();

  idea.id = idToStr(ideaDbo._id);
  idea.x = ideaDbo.x;
  idea.y = ideaDbo.y;
  idea.value = ideaDbo.value;

  return idea;
}

export function ideaToDbo(idea) {
  let ideaDbo = {};

  ideaDbo._id = strToId(idea.id);
  ideaDbo.x = idea.x;
  ideaDbo.y = idea.y;
  ideaDbo.value = idea.value;

  return ideaDbo;
}

export default {
  dboToIdea,
  ideaToDbo
}