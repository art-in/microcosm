import StateType from 'boot/client/State';

/**
 * Handles click event from go root button
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {model: {mindset: {root}}} = state;

    dispatch({
        type: 'animate-graph-viewbox-to-idea',
        data: {ideaId: root.id}
    });
}