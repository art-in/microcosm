import assert from 'assert';

import Point from 'vm/shared/Point';
import Node from 'vm/map/entities/Node';
import Idea from 'model/entities/Idea';

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
    node.isRoot = idea.isRoot;
    node.depth = idea.depth;

    node.color = idea.isRoot ?
        'yellow' :
        (idea.color || node.color);
    
    node.radius = 10;
    
    // deeper node is - smaller it gets
    node.scale = 1 / (node.depth + 1);

    return node;
}