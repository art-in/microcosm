import eq from 'utils/is-shallow-equal-objects';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import Point from 'model/entities/Point';
import getMindmapFocusNode from 'vm/map/utils/get-mindmap-focus-node';
import stopDrag from 'vm/map/entities/Mindmap/methods/stop-drag';
import setPositionAndScale from 'vm/map/entities/Mindmap/methods/set-position-and-scale';

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
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {mindmap}}}} = state;

  if (mindmap.drag.active) {
    // stop dragging node
    const {node, prev} = mindmap.drag;

    // stop dragging ASAP, so node is not draggable until dispatch is done
    await mutate(view('update-mindmap', stopDrag()));

    // make sure position was shifted
    if (!eq(node.posAbs, prev)) {
      // wait for idea position is set, thou mindmap is remapped to update
      // focus node
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
  } else if (mindmap.zoomInProgress) {
    // stop pinch zooming. active zoom guarantees that position was shifted.
    // wait for scale is set, thou mindmap is remapped to update focus node
    await mutate(
      view('update-mindmap', {
        zoomInProgress: false,
        ...setPositionAndScale({
          mindset,
          center: mindmap.viewbox.center,
          scale: mindmap.viewbox.scale
        })
      })
    );

    dispatch({
      type: 'set-mindset-focus-idea',
      data: {ideaId: getMindmapFocusNode(mindmap)}
    });
  } else if (mindmap.pan.active) {
    // stop panning. active pan guarantees that position was shifted.
    // no need to remap mindmap since panning does not move weight zones
    dispatch({
      type: 'set-mindset-focus-idea',
      data: {ideaId: getMindmapFocusNode(mindmap)}
    });

    return view('update-mindmap', {pan: {active: false}});
  }
}
