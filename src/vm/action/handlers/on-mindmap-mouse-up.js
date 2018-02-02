import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import Point from 'model/entities/Point';
import stopDrag from 'vm/map/entities/Mindmap/methods/stop-drag';
import getMindmapFocusNode from 'vm/map/utils/get-mindmap-focus-node';
import setPositionAndScale from 'vm/map/entities/Mindmap/methods/set-position-and-scale';

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
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {mindmap}}}} = state;

  // stop dragging node
  if (mindmap.drag.active) {
    // TODO: do not dispatch if position was not shifted (same as pan)
    //       update: pan is guaranteed to be shifted if active
    const node = mindmap.drag.node;

    dispatch({
      type: 'set-idea-position',
      data: {
        ideaId: node.id,
        posAbs: new Point(node.posAbs)
      }
    });

    return view('update-mindmap', stopDrag());
  }

  // stop panning
  if (mindmap.pan.active) {
    await mutate(
      view(
        'update-mindmap',
        setPositionAndScale({
          mindset,
          mindmap,
          center: mindmap.viewbox.center,
          scale: mindmap.viewbox.scale
        })
      )
    );

    dispatch({
      type: 'set-mindset-focus-idea',
      data: {ideaId: getMindmapFocusNode(mindmap)}
    });

    return view('update-mindmap', {
      pan: {active: false}
    });
  }
}
