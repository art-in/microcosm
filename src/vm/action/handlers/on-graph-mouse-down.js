import required from 'utils/required-params';
import view from 'vm/utils/patch-view';

/**
 * Handles mouse down event on graph
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.button
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {button} = required(data);
    
    if (button !== 'left') {
        // left button only
        return;
    }

    // start panning
    return view('update-graph', {
        pan: {active: true}
    });
}