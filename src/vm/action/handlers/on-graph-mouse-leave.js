import view from 'vm/utils/view-mutation';

import Patch from 'utils/state/Patch';
import getNode from 'vm/action/utils/get-node';

/**
 * Handles mouse leave action on graph
 * 
 * @param {object} state
 * @param {object} data
 * @return {Patch}
 */
export default function(state, data) {
    const {vm: {main: {mindmap: {graph}}}} = state;

    if (!graph.drag.active) {
        return;
    }

    const node = getNode(graph, graph.drag.node.id);
    
    return new Patch([

        // move node back at starting point
        view('update-node', {
            id: node.id,
            pos: {
                x: graph.drag.startX,
                y: graph.drag.startY
            }
        }),

        // stop dragging
        view('update-graph', {
            drag: {active: false}
        })
    ]);
}