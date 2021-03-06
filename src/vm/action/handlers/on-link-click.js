import required from 'utils/required-params';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';

import getDistance from 'utils/get-distance-between-points';
import toCanvasCoords from 'vm/map/utils/map-viewport-to-canvas-coords';

/**
 * Handles link click event
 *
 * @param {StateType} state
 * @param {object}    data
 * @param {string}    data.linkId
 * @param {PointType} data.viewportPos - mouse viewport position
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {
    vm: {
      main: {
        mindset: {mindmap}
      }
    }
  } = state;
  const {linkId, viewportPos} = required(data);

  const link = mindmap.links.find(l => l.id === linkId);

  if (link.shaded) {
    // do not handle clicks from shaded links.
    return;
  }

  const head = link.from;
  const tail = link.to;

  const headPos = head.posAbs;
  const tailPos = tail.posAbs;

  const mousePos = toCanvasCoords(viewportPos, mindmap.viewbox);

  // get target node to animate to
  let node;
  if (getDistance(mousePos, headPos) < getDistance(mousePos, tailPos)) {
    node = tail;
  } else {
    node = head;
  }

  dispatch({
    type: 'animate-mindmap-viewbox-to-idea',
    data: {ideaId: node.id}
  });
}
