import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import NodeType from 'vm/map/entities/Node';
import startDrag from 'vm/map/entities/Mindmap/methods/start-drag';

/**
 * Handles mouse down event on mindmap node
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.nodeId
 * @param {string} data.button
 * @param {function} dispatch
 * @return {PatchType|undefined}
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {mindmap}}}} = state;
  const {nodeId, button} = required(data);

  if (button !== 'left') {
    // left button only for node dragging
    return;
  }

  const node = mindmap.nodes.find(n => n.id === nodeId);

  if (node.shaded) {
    // prevent actions on shaded nodes
    return;
  }

  dispatch({type: 'deactivate-popups'});

  return view('update-mindmap', startDrag(node));
}
