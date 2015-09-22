import Point from 'client/viewmodels/misc/Point';
import Node from 'client/viewmodels/graph/Node';
import Idea from 'models/Idea';

export function ideaToNode(idea) {
  if (!(idea instanceof Idea)) { throw Error('invalid idea type'); }

  let node = new Node();

  node.id = idea.id;
  node.pos = new Point(idea.x, idea.y);
  node.title = idea.value;
  node.isCentral = idea.isCentral;
  node.color = idea.isCentral ? 'yellow' : (idea.color || node.color);

  return node;
}

export function nodeToIdea(node) {
  if (!(node instanceof Node)) { throw Error('invalid node type'); }

  let idea = new Idea();

  idea.id = node.id;
  idea.x = node.pos.x;
  idea.y = node.pos.y;
  idea.value = node.title;
  idea.isCentral = node.isCentral;
  idea.color = node.color;

  return idea;
}

export default {
  ideaToNode,
  nodeToIdea
}