import { getIdStr } from 'client/helpers/mongoHelpers';
import Point from 'client/viewmodels/Point';

export default {

  ideaToNode(idea) {
    return {
      id: getIdStr(idea),
      point: new Point(idea.x, idea.y)
    };
  }

}