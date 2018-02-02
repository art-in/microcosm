import Node from 'vm/map/entities/Node';
import IdeaType from 'model/entities/Idea';
import Point from 'model/entities/Point';

/**
 * Maps idea model to node view model
 * @param {IdeaType} idea
 * @return {Node}
 */
export default function ideaToNode(idea) {
  const node = new Node();

  node.id = idea.id;

  node.title.value = idea.title;

  node.isRoot = idea.isRoot;
  node.color = idea.color;

  node.radius = 5;

  node.isRoot = idea.isRoot;
  node.posAbs = new Point(idea.posAbs);

  node.rootPathWeight = idea.rootPathWeight;

  if (node.debug.enable) {
    node.debug.posRel = idea.posRel;
  }

  return node;
}
