import assert from 'assert';

import Node from 'vm/map/entities/Node';
import Idea from 'model/entities/Idea';

/**
 * Maps node view model to idea model
 * @param {Node} node
 * @param {Idea} idea
 * @return {Idea}
 */
export default function nodeToIdea(node, idea) {
    assert(node instanceof Node,
        `Object '${node}' is not a Node`);
    assert(idea instanceof Idea,
        `Object '${idea}' is not an Idea`);

    idea.id = node.id;
    idea.x = node.pos.x;
    idea.y = node.pos.y;
    idea.value = node.title.value;
    idea.isRoot = node.isRoot;
    idea.color = node.color;

    return idea;
}