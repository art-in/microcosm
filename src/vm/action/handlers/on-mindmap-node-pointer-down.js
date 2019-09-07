import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import PointerButton from 'vm/utils/PointerButton';
import startDrag from 'vm/map/entities/Mindmap/methods/start-drag';

/**
 * Handles pointer down event from mindmap node
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.nodeId
 * @param {PointerButton} data.button
 * @param {function} dispatch
 * @return {PatchType|undefined}
 */
export default function(state, data, dispatch) {
  const {
    vm: {
      main: {
        mindset: {mindmap}
      }
    }
  } = state;
  const {nodeId, button} = required(data);

  if (button !== PointerButton.primary) {
    // allow left button only for node dragging
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
