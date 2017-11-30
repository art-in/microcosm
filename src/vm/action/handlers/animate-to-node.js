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
 * Animates graph position and scale to target node
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
    
    // get target viewbox scale so target idea is in focus zone
    const targetViewboxScale = getGraphScaleForNode(node.scale);
    
    // get target viewbox pos so target idea is in the center
    let targetViewbox = clone(graph.viewbox);
    targetViewbox.scale = targetViewboxScale;
    targetViewbox = getViewboxSize({
        viewbox: targetViewbox,
        viewport: graph.viewport
    });

    const targetViewboxCenterPos = {
        x: targetViewbox.width / 2,
        y: targetViewbox.height / 2
    };

    const targetViewportPos = {
        x: node.posAbs.x - targetViewboxCenterPos.x,
        y: node.posAbs.y - targetViewboxCenterPos.y
    };

    // animate graph scale and position towards node
    await animate({
        values: [{
            from: graph.viewbox.x,
            to: targetViewportPos.x
        }, {
            from: graph.viewbox.y,
            to: targetViewportPos.y
        }, {
            from: graph.viewbox.scale,
            to: targetViewboxScale
        }],
        duration: 500,

        onStep: async ([x, y, scale]) => {

            let viewbox = clone(graph.viewbox);
            
            viewbox.scale = scale;
            viewbox.x = x;
            viewbox.y = y;

            viewbox = getViewboxSize({
                viewbox,
                viewport: graph.viewport
            });

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

    // TODO: do not follow link if 
    //       (a) mousedown-on-link (b) pan-graph (c) mouseup-on-link
    //       try prevent propagation of mouse-moves from Link to Graph
}