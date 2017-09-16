import traverseGraph from 'utils/graph/traverse-graph';

/**
 * Calls function on each idea in the graph
 * TODO: use traverse-graph directly, remove wrappers
 * 
 * @param {Node} idea - root idea
 * @param {function} visit
 */
export default function(idea, visit) {
    traverseGraph({
        node: idea,
        visit
    });
}