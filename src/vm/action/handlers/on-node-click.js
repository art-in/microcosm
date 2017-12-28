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
    const {vm: {main: {mindset: {graph}}}} = state;
    const {nodeId} = required(data);
    
    const node = graph.nodes.find(n => n.id === nodeId);

    if (node.shaded) {
        // do not handle clicks from shaded nodes
        return;
    }

    dispatch({
        type: 'open-idea-form-modal',
        data: {ideaId: nodeId}
    });

}