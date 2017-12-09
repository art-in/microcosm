import required from 'utils/required-params';

/**
 * Handles click event from graph node
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.nodeId
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {nodeId} = required(data);
    
    dispatch({
        type: 'open-idea-form-modal',
        data: {ideaId: nodeId}
    });

}