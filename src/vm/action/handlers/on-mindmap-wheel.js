import required from 'utils/required-params';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';

/**
 * Handles mindmap mouse wheel event
 * 
 * @param {StateType} state
 * @param {object}    data
 * @param {boolean}   data.up  - wheel up or down
 * @param {PointType} data.pos - target viewport position
 * @param {function} dispatch
 */
export default function onGraphWheel(state, data, dispatch) {
    const {vm: {main: {mindset: {mindmap}}}} = state;
    const {up, pos} = required(data);
    
    if (mindmap.zoomInProgress) {
        return;
    }

    dispatch({
        type: 'animate-mindmap-zoom',
        data: {up, pos},
        throttleLog: true
    });
}