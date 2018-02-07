import eq from 'utils/is-shallow-equal-objects';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import Point from 'model/entities/Point';
import stopDrag from 'vm/map/entities/Mindmap/methods/stop-drag';
import getMindmapFocusNode from 'vm/map/utils/get-mindmap-focus-node';

/**
 * Handles pointer up event on mindmap
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 * @return {Promise.<PatchType|undefined>}
 */
export default async function(state, data, dispatch, mutate) {
  const {vm: {main: {mindset: {mindmap}}}} = state;

  if (mindmap.drag.active) {
    // stop dragging node
    const {node, prev} = mindmap.drag;

    // stop dragging ASAP, so node is not draggable until dispatch is done
    await mutate(view('update-mindmap', stopDrag()));

    // make sure position was shifted
    if (!eq(node.posAbs, prev)) {
      // wait for position is set thou mindmap is remapped and has actual nodes,
      // to be able to update focus node
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
    }
  } else if (mindmap.pan.active) {
    // stop panning.
    // active panning guarantees that position was shifted.
    dispatch({
      type: 'set-mindset-focus-idea',
      data: {ideaId: getMindmapFocusNode(mindmap)}
    });

    return view('update-mindmap', {pan: {active: false}});
  }
}
