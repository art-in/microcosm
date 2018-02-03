import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import Point from 'model/entities/Point';
import stopDrag from 'vm/map/entities/Mindmap/methods/stop-drag';
import getMindmapFocusNode from 'vm/map/utils/get-mindmap-focus-node';

/**
 * Handles mouse up event on mindmap
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 * @return {Promise.<PatchType|undefined>}
 */
export default async function(state, data, dispatch, mutate) {
  const {vm: {main: {mindset: {mindmap}}}} = state;

  // stop dragging node
  if (mindmap.drag.active) {
    // TODO: do not dispatch if position was not shifted (same as pan)
    //       update: pan is guaranteed to be shifted if active
    const node = mindmap.drag.node;

    await mutate(view('update-mindmap', stopDrag()));

    await dispatch({
      type: 'set-idea-position',
      data: {
        ideaId: node.id,
        posAbs: new Point(node.posAbs)
      }
    });

    dispatch({
      type: 'set-mindset-focus-idea',
      data: {ideaId: getMindmapFocusNode(mindmap)}
    });

    return;
  }

  // stop panning
  if (mindmap.pan.active) {
    dispatch({
      type: 'set-mindset-focus-idea',
      data: {ideaId: getMindmapFocusNode(mindmap)}
    });

    return view('update-mindmap', {pan: {active: false}});
  }
}
