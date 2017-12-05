import StateType from 'boot/client/State';

/**
 * Handles graph click event
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    dispatch({type: 'deactivate-popups'});
}