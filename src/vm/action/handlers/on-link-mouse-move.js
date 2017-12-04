import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';

import toCanvasCoords from 'vm/map/utils/map-viewport-to-canvas-coords';
import getDistance from 'utils/get-distance-between-points';

/**
 * Handles link mouse move event
 * 
 * @param {StateType} state
 * @param {object}    data
 * @param {string}    data.linkId
 * @param {PointType} data.viewportPos - mouse viewport position
 * @return {PatchType}
 */
export default function onLinkMouseMove(state, data) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {linkId, viewportPos} = required(data);
    
    const link = graph.links.find(l => l.id === linkId);

    if (link.shaded) {
        // do not highlight shaded links.
        return;
    }

    const head = link.from;
    const tail = link.to;

    const headPos = head.posAbs;
    const tailPos = tail.posAbs;

    const mousePos = toCanvasCoords(viewportPos, graph.viewbox);

    // shift tooltip below mouse cursor
    viewportPos.x += 15;
    viewportPos.y += 15;

    // 1. find what idea is closer to mouse position
    // 2. show opposite idea in the tooltip
    let tooltipValue;
    if (getDistance(mousePos, headPos) < getDistance(mousePos, tailPos)) {
        tooltipValue = `to: ${tail.title.value}`;
    } else {
        tooltipValue = `from: ${head.title.value}`;
    }

    return view('update-link', {
        id: linkId,
        highlighted: true,
        tooltip: {
            visible: true,
            viewportPos,
            value: tooltipValue
        }
    });
}