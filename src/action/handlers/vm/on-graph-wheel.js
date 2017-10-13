import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

/**
 * Handles graph mouse wheel event
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.up
 * @param {Point} data.pos
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {up, pos} = required(data);
    
    dispatch({
        type: 'animate-graph-zoom',
        data: {up, pos}
    });
}