import assert from 'assert';

import Point from 'ui/viewmodels/misc/Point';
import Node from 'ui/viewmodels/graph/Node';
import Idea from 'domain/models/Idea';

/**
 * Maps idea model to node view model
 * @param {Idea} idea
 * @return {Node}
 */
export function ideaToNode(idea) {
    assert(idea instanceof Idea);

    const node = new Node();

    node.id = idea.id;
    node.pos = new Point(idea.x, idea.y);
    node.title.value = idea.value;
    node.isCentral = idea.isCentral;
    node.color = idea.isCentral ? 'yellow' : (idea.color || node.color);
    node.radius = idea.isCentral ? 15 : 10;

    return node;
}

/**
 * Maps node view model to idea model
 * @param {Node} node
 * @param {Idea} idea
 * @return {Idea}
 */
export function nodeToIdea(node, idea) {
    assert(node instanceof Node);
    assert(idea instanceof Idea);

    idea.id = node.id;
    idea.x = node.pos.x;
    idea.y = node.pos.y;
    idea.value = node.title.value;
    idea.isCentral = node.isCentral;
    idea.color = node.color;

    return idea;
}