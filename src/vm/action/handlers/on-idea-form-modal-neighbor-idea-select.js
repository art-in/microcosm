import required from 'utils/required-params';

import StateType from 'boot/client/State';

/**
 * Handles heighbor idea select event from idea form modal
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {ideaId} = required(data);
    
    dispatch({
        type: 'open-idea-form-modal',
        data: {ideaId}
    });

    dispatch({
        type: 'animate-mindmap-viewbox-to-idea',
        data: {ideaId}
    });
}