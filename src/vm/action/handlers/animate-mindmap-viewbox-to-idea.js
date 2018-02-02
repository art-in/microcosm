import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import Point from 'model/entities/Point';
import animate from 'vm/utils/animate';
import getIdea from 'action/utils/get-idea';

import computePositionAndSize from 'vm/map/entities/Viewbox/methods/compute-position-and-size';
import getMindmapScaleForNode from 'vm/map/utils/get-mindmap-scale-for-node';
import getNodeScaleForWeight from 'vm/map/utils/get-node-scale-for-weight';
import getMindmapFocusNode from 'vm/map/utils/get-mindmap-focus-node';
import setPositionAndScale from 'vm/map/entities/Mindmap/methods/set-position-and-scale';

/**
 * Animates mindmap viewbox to idea
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId - target idea ID
 * @param {function} [data.scheduleAnimationStep]
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
  const {model: {mindset}, vm: {main: {mindset: {mindmap}}}} = state;
  const {ideaId} = required(data);
  const {scheduleAnimationStep} = data;

  const idea = getIdea(mindset, ideaId);

  const currentViewboxScale = mindmap.viewbox.scale;

  // target viewbox scale where target idea will be in the center of focus zone
  const nodeScale = getNodeScaleForWeight(idea.rootPathWeight);
  const targetViewboxScale = getMindmapScaleForNode(nodeScale);

  // animate viewbox center and scale towards target idea
  await animate({
    values: [
      {
        from: mindmap.viewbox.center.x,
        to: idea.posAbs.x
      },
      {
        from: mindmap.viewbox.center.y,
        to: idea.posAbs.y
      },
      {
        from: currentViewboxScale,
        to: targetViewboxScale
      }
    ],
    duration: 500,
    scheduleAnimationStep,

    onStep: async ([viewboxCenterX, viewboxCenterY, scale]) => {
      const center = new Point({x: viewboxCenterX, y: viewboxCenterY});

      await mutate(
        view('update-mindmap', {
          viewbox: computePositionAndSize({
            viewport: mindmap.viewport,
            center,
            scale
          })
        })
      );
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
}
