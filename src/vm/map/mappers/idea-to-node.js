import assert from 'utils/assert';

import Node from 'vm/map/entities/Node';
import Idea from 'model/entities/Idea';
import Point from 'model/entities/Point';

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
    
    node.title.value = idea.value;
    node.isRoot = idea.isRoot;
    node.color = idea.color;
    
    node.radius = 5;
    
    node.isRoot = idea.isRoot;
    node.posAbs = new Point(idea.posAbs);

    node.debugInfo.rootPathWeight = idea.rootPathWeight;
    node.debugInfo.posRel = idea.posRel;

    return node;
}