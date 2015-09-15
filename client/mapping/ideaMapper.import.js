import { getIdStr } from 'client/lib/mongoHelpers';

export default {

  ideaToNode(idea) {
    return {
      id: getIdStr(idea),
      x: idea.x,
      y: idea.y
    };
  }

}