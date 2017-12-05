import StateType from 'boot/client/State';

/**
 * Handles click event from idea search box trigger
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    dispatch({
        type: 'activate-idea-search-box'
    });
}