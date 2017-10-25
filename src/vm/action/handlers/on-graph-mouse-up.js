import view from 'vm/utils/view-patch';

import Point from 'vm/shared/Point';
import stopDrag from 'vm/map/entities/Graph/methods/stop-drag';

/**
 * Handles mouse up event on graph
 * 
 * @param {object} state
 * @param {object} data
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;

    // stop dragging node
    if (graph.drag.active) {

        // TODO: do not dispatch if position was not shifted (same as pan)
        dispatch({
            type: 'set-idea-position',
            data: {
                ideaId: graph.drag.node.id,
                pos: graph.drag.node.pos
            }
        });

        return view('update-graph', stopDrag());
    }
    
    // stop panning
    if (graph.pan.active) {

        if (graph.pan.shifted) {
            dispatch({
                type: 'set-mindmap-position',
                data: {
                    mindmapId: graph.id,
                    pos: new Point(graph.viewbox.x, graph.viewbox.y)
                }
            });
        }

        return view('update-graph', {
            pan: {
                active: false,
                shifted: false
            }
        });
    }
}