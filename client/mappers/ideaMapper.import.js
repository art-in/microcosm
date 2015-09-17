import Point from 'client/viewmodels/Point';
import Node from 'client/viewmodels/graph/Node';
import Idea from 'models/Idea';

export default {

  ideaToNode(idea) {
    if (!(idea instanceof Idea)) { throw Error('invalid idea type'); }

    let node = new Node();

    node.id = idea.id;
    node.pos = new Point(idea.x, idea.y);

    return node;
  },

  nodeToIdea(node) {
    if (!(node instanceof Node)) { throw Error('invalid node type'); }

    let idea = new Idea();

    idea.id = node.id;
    idea.x = node.pos.x;
    idea.y = node.pos.y;

    return idea;
  }

}