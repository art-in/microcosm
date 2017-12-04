import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import clone from 'clone';

import StateType from 'boot/client/State';

import Point from 'model/entities/Point';
import NodeType from 'vm/map/entities/Node';

import animate from 'vm/utils/animate';
import getViewboxSize from 'vm/map/entities/Graph/methods/compute-viewbox-size';
import getGraphScaleForNode from 'vm/map/utils/get-graph-scale-for-node-scale';

/**
 * Animates viewbox to target node
 * 
 * @param {StateType} state
 * @param {object}   data
 * @param {NodeType} data.node - target node
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {node} = required(data);
    
    const currentViewboxScale = graph.viewbox.scale;

    // target viewbox scale is scale in which target idea will be in focus zone
    const targetViewboxScale = getGraphScaleForNode(node.scale);
    
    const currentViewboxCenterPos = {
        x: graph.viewbox.x + (graph.viewbox.width / 2),
        y: graph.viewbox.y + (graph.viewbox.height / 2)
    };

    // target position of viewbox center is position of idea itself
    const targetViewboxCenterPos = node.posAbs;

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