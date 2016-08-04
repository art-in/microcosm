import assert from 'assert';

import Point from 'client/viewmodels/misc/Point';
import Node from 'client/viewmodels/graph/Node';
import Idea from 'models/Idea';

export function ideaToNode(idea) {
    assert(idea instanceof Idea);

    let node = new Node();

    node.id = idea.id;
    node.pos = new Point(idea.x, idea.y);
    node.title.value = idea.value;
    node.isCentral = idea.isCentral;
    node.color = idea.isCentral ? 'yellow' : (idea.color || node.color);
    node.radius = idea.isCentral ? 15 : 10;

    return node;
}

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
