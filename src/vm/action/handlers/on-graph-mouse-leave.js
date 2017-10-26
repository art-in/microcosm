import view from 'vm/utils/view-mutation';

import Patch from 'utils/state/Patch';
import getNode from 'vm/action/utils/get-node';
import stopDrag from 'vm/map/entities/Graph/methods/stop-drag';

/**
 * Handles mouse leave action on graph
 * 
 * @param {object} state
 * @param {object} data
 * @return {Patch}
 */
export default function(state, data) {
    const {vm: {main: {mindmap: {graph}}}} = state;

    // TODO: cancel pan too
    if (!graph.drag.active) {
        return;
    }

    const node = getNode(graph, graph.drag.node.id);
    
    return new Patch([

        // move node back to starting point
        view('update-node', {
            id: node.id,
            pos: {
                x: graph.drag.startX,
                y: graph.drag.startY
            }
        }),

        // stop dragging
        view('update-graph', stopDrag())
    ]);
}