import view from 'vm/utils/view-mutation';

import StateType from 'boot/client/State';

import Patch from 'utils/state/Patch';
import getNode from 'vm/action/utils/get-node';
import stopDrag from 'vm/map/entities/Graph/methods/stop-drag';

/**
 * Handles mouse leave action on graph
 * 
 * @param {StateType} state
 * @return {Patch|undefined}
 */
export default function(state) {
    const {vm: {main: {mindset: {graph}}}} = state;

    // TODO: cancel pan too
    if (!graph.drag.active) {
        return;
    }

    const node = getNode(graph, graph.drag.node.id);
    const nodes = graph.drag.nodes;

    const patch = new Patch();

    // move node and child sub-tree back to starting point
    const dx = node.posAbs.x - graph.drag.startX;
    const dy = node.posAbs.y - graph.drag.startY;

    nodes.forEach(n => patch.push(
        view('update-node', {
            id: n.id,
            posAbs: {
                x: n.posAbs.x - dx,
                y: n.posAbs.y - dy
            }
        })));

    // stop dragging
    patch.push(view('update-graph', stopDrag()));

    return patch;
}