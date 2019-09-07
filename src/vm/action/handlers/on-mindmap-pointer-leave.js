import view from 'vm/utils/view-mutation';

import StateType from 'boot/client/State';

import Patch from 'utils/state/Patch';
import getNode from 'vm/action/utils/get-node';
import stopDrag from 'vm/map/entities/Mindmap/methods/stop-drag';

/**
 * Handles pointer leave action on mindmap
 *
 * @param {StateType} state
 * @return {Patch|undefined}
 */
export default function(state) {
  const {
    vm: {
      main: {
        mindset: {mindmap}
      }
    }
  } = state;

  // TODO: cancel pan too
  if (!mindmap.drag.active) {
    return;
  }

  const node = getNode(mindmap, mindmap.drag.node.id);
  const nodes = mindmap.drag.nodes;

  const patch = new Patch();

  // move node and child sub-tree back to starting point
  const dx = node.posAbs.x - mindmap.drag.prev.x;
  const dy = node.posAbs.y - mindmap.drag.prev.y;

  nodes.forEach(n =>
    patch.push(
      view('update-node', {
        id: n.id,
        posAbs: {
          x: n.posAbs.x - dx,
          y: n.posAbs.y - dy
        }
      })
    )
  );

  // stop dragging
  patch.push(view('update-mindmap', stopDrag()));

  return patch;
}
