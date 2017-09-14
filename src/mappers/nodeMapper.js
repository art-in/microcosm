import assert from 'assert';

import Point from 'ui/viewmodels/misc/Point';
import Node from 'ui/viewmodels/graph/Node';
import Idea from 'domain/models/Idea';

// TODO: split up mappers to different files
// TODO: use dashed notation in file names instead of camel case.

/**
 * Maps idea model to node view model
 * @param {Idea} idea
 * @return {Node}
 */
export function ideaToNode(idea) {
    assert(idea instanceof Idea,
        `Object '${idea}' is not an Idea`);

    const node = new Node();

    node.id = idea.id;
    node.pos = new Point(idea.x, idea.y);
    node.title.value = idea.value;
    node.isCentral = idea.isCentral;
    node.color = idea.isCentral ? 'yellow' : (idea.color || node.color);
    node.radius = idea.isCentral ? 15 : 10;
    node.depth = idea.depth;

    return node;
}

/**
 * Maps node view model to idea model
 * @param {Node} node
 * @param {Idea} idea
 * @return {Idea}
 */
export function nodeToIdea(node, idea) {
    assert(node instanceof Node,
        `Object '${node}' is not a Node`);
    assert(idea instanceof Idea,
        `Object '${idea}' is not an Idea`);

    idea.id = node.id;
    idea.x = node.pos.x;
    idea.y = node.pos.y;
    idea.value = node.title.value;
    idea.isCentral = node.isCentral;
    idea.color = node.color;

    return idea;
}