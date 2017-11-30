import required from 'utils/required-params';

import StateType from 'boot/client/State';

/**
 * Handles change event on node title
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.nodeId
 * @param {string} data.title
 * @param {function} dispatch
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
}