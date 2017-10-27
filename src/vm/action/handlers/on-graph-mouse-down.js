import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

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
    // TODO: do not interpret all mousedowns as panning,
    // this leads to alot of wasted graph updates in case
    // graph was simply clicked but not moved.
    // instead check buttons state on 'mousemove', if left
    // button pressed while moving - it is panning.
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    return view('update-graph', {
        pan: {active: true}
    });
}