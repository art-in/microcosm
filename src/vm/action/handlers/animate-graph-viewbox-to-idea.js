import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import clone from 'clone';

import StateType from 'boot/client/State';

import Point from 'model/entities/Point';

import animate from 'vm/utils/animate';
import getViewboxSize from 'vm/map/entities/Graph/methods/compute-viewbox-size';
import getGraphScaleForNode from 'vm/map/utils/get-graph-scale-for-node-scale';
import getNodeScaleForWeight from 'vm/map/utils/get-node-scale-for-weight';
import getIdea from 'action/utils/get-idea';

/**
 * Animates graph viewbox to idea
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId - target idea ID
 * @param {function} [data.scheduleAnimationStep]
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
    const {model: {mindmap}, vm: {main: {mindmap: {graph}}}} = state;
    const {ideaId} = required(data);
    const {scheduleAnimationStep} = data;
    
    const idea = getIdea(mindmap, ideaId);

    const currentViewboxScale = graph.viewbox.scale;

    // target viewbox scale is scale in which target idea will be in focus zone
    const nodeScale = getNodeScaleForWeight(idea.rootPathWeight);
    const targetViewboxScale = getGraphScaleForNode(nodeScale);
    
    const currentViewboxCenterPos = {
        x: graph.viewbox.x + (graph.viewbox.width / 2),
        y: graph.viewbox.y + (graph.viewbox.height / 2)
    };

    // target position of viewbox center is position of idea itself
    const targetViewboxCenterPos = idea.posAbs;

    // animate viewbox center and scale to target idea
    await animate({
        values: [{
            from: currentViewboxCenterPos.x,
            to: targetViewboxCenterPos.x
        }, {
            from: currentViewboxCenterPos.y,
            to: targetViewboxCenterPos.y
        }, {
            from: currentViewboxScale,
            to: targetViewboxScale
        }],
        duration: 500,
        scheduleAnimationStep,

        onStep: async ([viewboxCenterX, viewboxCenterY, scale]) => {

            let viewbox = clone(graph.viewbox);
            
            viewbox.scale = scale;

            // calculate new width/height of viewbox
            viewbox = getViewboxSize({
                viewbox,
                viewport: graph.viewport
            });

            // calculate new position of top-left corner of viewbox
            viewbox.x = viewboxCenterX - (viewbox.width / 2);
            viewbox.y = viewboxCenterY - (viewbox.height / 2);

            await mutate(view('update-graph', {viewbox}));
        }
    });

    await dispatch({
        type: 'set-mindmap-scale',
        data: {
            mindmapId: graph.id,
            scale: graph.viewbox.scale,
            pos: new Point({
                x: graph.viewbox.x,
                y: graph.viewbox.y
            })
        }
    });
}