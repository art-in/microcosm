import Idea from 'models/Idea';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export function dboToIdea(ideaDO) {
  let idea = new Idea();

  idea.id = idToStr(ideaDO._id);
  idea.x = ideaDO.x;
  idea.y = ideaDO.y;

  return idea;
}

export function ideaToDbo(idea) {
  let ideaDO = {};

  ideaDO._id = strToId(idea.id);
  ideaDO.x = idea.x;
  ideaDO.y = idea.y;

  return ideaDO;
}

export default {
  dboToIdea,
  ideaToDbo
}