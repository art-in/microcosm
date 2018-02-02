import required from 'utils/required-params';

/**
 * Handles click event from mindmap node
 *
 * @param {object} state
 * @param {object} data
 * @param {string} data.nodeId
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {mindmap}}}} = state;
  const {nodeId} = required(data);

  const node = mindmap.nodes.find(n => n.id === nodeId);

  if (node.shaded) {
    // do not handle clicks from shaded nodes
    return;
  }

  dispatch({
    type: 'mindmap-open-idea',
    data: {ideaId: nodeId}
  });
}
