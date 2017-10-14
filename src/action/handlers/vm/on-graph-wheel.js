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
    const {up, pos} = required(data);
    
    dispatch({
        type: 'animate-graph-zoom',
        data: {up, pos}
    });
}