import required from 'utils/required-params';
import Patch from 'utils/state/Patch';
import eq from 'utils/is-shallow-equal-arrays';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';
import Point from 'model/entities/Point';

import getDistance from 'utils/get-distance-between-points';
import getMiddle from 'utils/get-middle-between-points';

import view from 'vm/utils/view-mutation';
import viewPatch from 'vm/utils/view-patch';
import PointerButton from 'vm/utils/PointerButton';
import PointerType from 'vm/utils/Pointer';
import toCanvasCoords from 'vm/map/utils/map-viewport-to-canvas-coords';
import toViewboxCoords from 'vm/map/utils/map-viewport-to-viewbox-coords';
import zoom from 'vm/map/entities/Viewbox/methods/zoom';
import computePositionAndSize from 'vm/map/entities/Viewbox/methods/compute-position-and-size';

// higher value - slower pinch zoom
const PINCH_ZOOM_SPEED = 500;

/**
 * Handles pointer move event from mindmap
 *
 * @param {StateType} state
 * @param {object} data
 * @param {PointerType} data.pointer - active pointer that triggered the event
 * @param {Array.<PointerType>} data.activePointers - all active pointers
 * @param {PointType} data.viewportShift - position shift relative to viewport
 * @param {function} dispatch
 * @return {Patch|undefined}
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {mindmap}}}} = state;
  const {pointer, activePointers, viewportShift} = required(data);

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

  const pointersWithPrimaryButtonPressed = activePointers.filter(p =>
    eq(p.pressedButtons, [PointerButton.primary])
  );

  // zoom with multi-pointer gesture (pinch zoom)
  if (pointersWithPrimaryButtonPressed.length > 1) {
    // get zoom target position as middle position between last two pointers
    const pointerA = pointer;
    let pointerB = activePointers[activePointers.length - 1];

    if (pointerB === pointerA) {
      pointerB = activePointers[activePointers.length - 2];
    }

    const posA = toCanvasCoords(pointerA.pos, mindmap.viewbox);
    const posB = toCanvasCoords(pointerB.pos, mindmap.viewbox);

    const middleCanvasPos = getMiddle(posA, posB);

    // get zoom direction (in or out)
    const prevPosA = new Point({
      x: posA.x - viewboxShift.x,
      y: posA.y - viewboxShift.y
    });

    const prevDistance = getDistance(prevPosA, posB);
    const distance = getDistance(posA, posB);

    const zoomIn = distance > prevDistance;

    // get zoom amount
    const viewportShiftDistance = getDistance(
      {x: 0, y: 0},
      {x: viewportShift.x, y: viewportShift.y}
    );
    const zoomAmount = viewportShiftDistance / PINCH_ZOOM_SPEED;

    // set scale
    let scale = mindmap.viewbox.scale;

    if (zoomIn) {
      scale += zoomAmount;
    } else {
      scale -= zoomAmount;
    }

    return viewPatch('update-mindmap', {
      zoomInProgress: true,
      viewbox: zoom({
        viewbox: mindmap.viewbox,
        viewport: mindmap.viewport,
        scale,
        canvasPos: middleCanvasPos
      })
    });
  }

  // pan
  if (pointersWithPrimaryButtonPressed.length === 1) {
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
