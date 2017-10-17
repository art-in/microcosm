import required from 'utils/required-params';

/**
 * Handles graph mouse wheel event
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.up  - wheel up or down
 * @param {Point}  data.pos - target viewport position
 * @param {function} dispatch
 */
export default function onGraphWheel(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {up, pos} = required(data);
    
    if (graph.zoomInProgress) {
        return;
    }

    dispatch({
        type: 'animate-graph-zoom',
        data: {up, pos},
        throttleLog: true
    });
}