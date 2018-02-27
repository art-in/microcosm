import StateType from 'boot/client/State';

/**
 * Handles click event from mindset server database connection icon
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  dispatch({type: 'open-auth-screen'});
}
