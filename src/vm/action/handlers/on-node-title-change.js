import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

/**
 * Handles change event on node title
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.nodeId
 * @param {string} data.title
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
    const {nodeId, title} = required(data);
    
    dispatch({
        type: 'set-idea-value',
        data: {
            ideaId: nodeId,
            value: title
        },
        throttleLog: true
    });

    // stop title edit
    return view('update-node', {
        id: nodeId,
        title: {
            editing: false
        }
    });
}