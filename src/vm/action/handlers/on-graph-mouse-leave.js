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
    const nodes = graph.drag.nodes;

    const patch = new Patch();

    // move node and child sub-tree back to starting point
    const dx = node.pos.x - graph.drag.startX;
    const dy = node.pos.y - graph.drag.startY;

    nodes.forEach(n => patch.push(
        view('update-node', {
            id: n.id,
            pos: {
                x: n.pos.x - dx,
                y: n.pos.y - dy
            }
        })));

    // stop dragging
    patch.push(view('update-graph', stopDrag()));

    return patch;
}