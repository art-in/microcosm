import Point from 'client/viewmodels/Point';
import Node from 'client/viewmodels/graph/Node';
import Idea from 'models/Idea';
import { idFromStr, strFromId } from 'client/lib/helpers/mongoHelpers';

export default {

  doToIdea(ideaDO) {
    let idea = new Idea();

    idea._id = ideaDO._id;
    idea.x = ideaDO.x;
    idea.y = ideaDO.y;

    return idea;
  },

  ideaToNode(idea) {
    if (!(idea instanceof Idea)) { throw Error('invalid idea type'); }

    let node = new Node();

    node.id = strFromId(idea._id);
    node.pos = new Point(idea.x, idea.y);

    return node;
  },

  nodeToIdea(node) {
    if (!(node instanceof Node)) { throw Error('invalid node type'); }

    let idea = new Idea();

    idea._id = idFromStr(node.id);
    idea.x = node.pos.x;
    idea.y = node.pos.y;

    return idea;
  }

}