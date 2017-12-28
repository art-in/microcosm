import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import Point from 'model/entities/Point';
import stopDrag from 'vm/map/entities/Mindmap/methods/stop-drag';

/**
 * Handles mouse up event on mindmap
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @return {PatchType|undefined}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindset: {mindmap}}}} = state;

    // stop dragging node
    if (mindmap.drag.active) {

        // TODO: do not dispatch if position was not shifted (same as pan)
        //       update: pan is guaranteed to be shifted if active
        const node = mindmap.drag.node;

        dispatch({
            type: 'set-idea-position',
            data: {
                ideaId: node.id,
                posAbs: new Point(node.posAbs)
            }
        });

        return view('update-mindmap', stopDrag());
    }
    
    // stop panning
    if (mindmap.pan.active) {

        dispatch({
            type: 'set-mindset-position-and-scale',
            data: {
                mindsetId: mindmap.id,
                pos: new Point({x: mindmap.viewbox.x, y: mindmap.viewbox.y})
            }
        });

        return view('update-mindmap', {
            pan: {active: false}
        });
    }
}