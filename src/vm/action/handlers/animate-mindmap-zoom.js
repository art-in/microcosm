import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import view from 'vm/utils/view-patch';
import animate from 'vm/utils/animate';

import zoom from 'vm/map/entities/Viewbox/methods/zoom';
import canScaleMore from 'vm/map/entities/Viewbox/methods/can-scale-more';
import toCanvasCoords from 'vm/map/utils/map-viewport-to-canvas-coords';
import getMindmapFocusNode from 'vm/map/utils/get-mindmap-focus-node';
import setPositionAndScale from 'vm/map/entities/Mindmap/methods/set-position-and-scale';

/**
 * Animates mindmap scale towards certain canvas position
 *
 * @param {StateType} state
 * @param {object}   data
 * @param {object}   data.up  - scale up or down
 * @param {object}   data.viewportPos - target viewport position
 * @param {function} [data.scheduleAnimationStep]
 * @param {function} dispatch
 * @param {function} mutate
 * @return {Promise.<PatchType|undefined>}
 */
export default async function(state, data, dispatch, mutate) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {mindmap}}}} = state;
  const {up, viewportPos} = required(data);
  const {scheduleAnimationStep} = data;

  const {viewbox, zoomInProgress} = mindmap;

  if (zoomInProgress || !canScaleMore({viewbox, up})) {
    // zoom already running or limits reached
    return;
  }

  mutate(view('update-mindmap', {zoomInProgress: true}));

  // convert coordinates from viewport to canvas
  const canvasPos = toCanvasCoords(viewportPos, viewbox);

  const scaleStep = 0.5;
  const targetScale = viewbox.scale + (up ? 1 : -1) * scaleStep * viewbox.scale;

  // animate mindmap scale
  await animate({
    values: [
      {
        from: mindmap.viewbox.scale,
        to: targetScale
      }
    ],
    duration: 250,
    scheduleAnimationStep,

    onStep: async ([scale]) => {
      const viewbox = zoom({
        viewbox: mindmap.viewbox,
        viewport: mindmap.viewport,
        scale,
        canvasPos
      });
      await mutate(view('update-mindmap', {viewbox}));
    }
  });

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

  return view('update-mindmap', {zoomInProgress: false});
}
