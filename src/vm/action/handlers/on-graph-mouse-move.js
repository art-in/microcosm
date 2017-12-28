import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';

import view from 'vm/utils/view-mutation';
import toViewboxCoords from 'vm/map/utils/map-viewport-to-viewbox-coords';

/**
 * Handles mouse move on graph
 * 
 * @param {StateType} state
 * @param {object}     data
 * @param {PointType}  data.viewportShift
 * @param {string}     data.pressedMouseButton - left or null (TODO: or null?)
 * @param {function} dispatch
 * @return {Patch|undefined}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindset: {graph}}}} = state;
    const {viewportShift, pressedMouseButton} = required(data);

    const viewboxShift = toViewboxCoords(viewportShift, graph.viewbox);

    // drag node step
    if (graph.drag.active) {

        const patch = new Patch();

        // move target node and child sub-tree
        graph.drag.nodes.forEach(n => {
            patch.push(view('update-node', {
                id: n.id,
                posAbs: {
                    x: n.posAbs.x + viewboxShift.x,
                    y: n.posAbs.y + viewboxShift.y
                }
            }));
        });

        return patch;
    }

    // pan
    if (pressedMouseButton === 'left') {

        const patch = new Patch();

        // activate panning if not yet activated
        // TODO: normalize patch
        if (!graph.pan.active) {
            dispatch({type: 'deactivate-popups'});

            patch.push(view('update-graph', {
                pan: {active: true}
            }));
        }

        // make pan step
        patch.push(view('update-graph', {
            viewbox: {
                x: graph.viewbox.x - viewboxShift.x,
                y: graph.viewbox.y - viewboxShift.y
            }
        }));

        return patch;
    }
}