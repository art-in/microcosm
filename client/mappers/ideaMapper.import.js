import { getIdStr } from 'client/helpers/mongoHelpers';

export default {

  ideaToNode(idea) {
    return {
      id: getIdStr(idea),
      x: idea.x,
      y: idea.y
    };
  }

}