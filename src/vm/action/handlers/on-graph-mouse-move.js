import required from 'utils/required-params';
import view from 'vm/utils/patch-view';

import mapToViewboxCoords from 'vm/action/utils/map-viewport-to-viewbox-coords';
import getNode from 'vm/action/utils/get-node';

/**
 * Handles mouse move on graph
 * 
 * @param {object} state
 * @param {object} data
 * @param {Point} data.viewportShift
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {viewportShift} = required(data);

    const viewboxShift = mapToViewboxCoords(viewportShift, graph.viewbox);

    // drag node
    if (graph.drag.active) {

        const node = getNode(graph, graph.drag.node.id);
        
        return view('update-node', {
            id: node.id,
            pos: {
                x: node.pos.x + viewboxShift.x,
                y: node.pos.y + viewboxShift.y
            }
        });
    }

    // pan
    if (graph.pan.active) {

        return view('update-graph', {
            pan: {
                shifted: true
            },
            viewbox: {
                x: graph.viewbox.x - viewboxShift.x,
                y: graph.viewbox.y - viewboxShift.y
            }
        });
    }
}