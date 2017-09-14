import assert from 'assert';

import Point from 'ui/viewmodels/misc/Point';
import Node from 'ui/viewmodels/graph/Node';
import Idea from 'domain/models/Idea';

/**
 * Maps idea model to node view model
 * @param {Idea} idea
 * @return {Node}
 */
export default function ideaToNode(idea) {
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