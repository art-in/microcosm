import required from 'utils/required-params';

import getDistance from 'utils/get-distance-between-points';
import toCanvasCoords from 'vm/map/utils/map-viewport-to-canvas-coords';

/**
 * Handles link click event
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.linkId
 * @param {string} data.viewportPos - mouse viewport position
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {linkId, viewportPos} = required(data);
 
    const link = graph.links.find(l => l.id === linkId);

    const head = link.from;
    const tail = link.to;

    const headPos = head.posAbs;
    const tailPos = tail.posAbs;

    const mousePos = toCanvasCoords(viewportPos, graph.viewbox);

    // get target node to animate to
    let node;
    if (getDistance(mousePos, headPos) < getDistance(mousePos, tailPos)) {
        node = tail;
    } else {
        node = head;
    }

    dispatch({
        type: 'animate-to-node',
        data: {node}
    });
}