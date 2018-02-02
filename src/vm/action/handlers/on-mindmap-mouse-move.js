import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';
import Point from 'model/entities/Point';

import view from 'vm/utils/view-mutation';
import toViewboxCoords from 'vm/map/utils/map-viewport-to-viewbox-coords';
import computePositionAndSize from 'vm/map/entities/Viewbox/methods/compute-position-and-size';

/**
 * Handles mouse move on mindmap
 *
 * @param {StateType} state
 * @param {object}     data
 * @param {PointType}  data.viewportShift
 * @param {string}     data.pressedMouseButton - left or null (TODO: or null?)
 * @param {function} dispatch
 * @return {Patch|undefined}
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {mindmap}}}} = state;
  const {viewportShift, pressedMouseButton} = required(data);

  const viewboxShift = toViewboxCoords(viewportShift, mindmap.viewbox);

  // drag node step
  if (mindmap.drag.active) {
    const patch = new Patch();

    // move target node and child sub-tree
    mindmap.drag.nodes.forEach(n => {
      patch.push(
        view('update-node', {
          id: n.id,
          posAbs: {
            x: n.posAbs.x + viewboxShift.x,
            y: n.posAbs.y + viewboxShift.y
          }
        })
      );
    });

    return patch;
  }

  // pan
  if (pressedMouseButton === 'left') {
    const patch = new Patch();

    // activate panning if not yet activated
    // TODO: normalize patch
    if (!mindmap.pan.active) {
      dispatch({type: 'deactivate-popups'});

      patch.push(
        view('update-mindmap', {
          pan: {active: true}
        })
      );
    }

    // make pan step
    const newPos = new Point({
      x: mindmap.viewbox.center.x - viewboxShift.x,
      y: mindmap.viewbox.center.y - viewboxShift.y
    });

    patch.push(
      view('update-mindmap', {
        viewbox: computePositionAndSize({
          viewport: mindmap.viewport,
          center: newPos,
          scale: mindmap.viewbox.scale
        })
      })
    );

    return patch;
  }
}
