import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import NodeType from 'vm/map/entities/Node';

import getDescendants from 'utils/graph/get-descendants';

/**
 * Handles mouse down event on graph node
 * 
 * @param {StateType} state
 * @param {object}   data
 * @param {NodeType} data.node
 * @param {string}   data.button
 * @return {PatchType|undefined}
 */
export default function(state, data) {
    const {node, button} = required(data);
    
    if (button !== 'left') {
        // left button only
        return;
    }

    if (node.shaded) {
        // prevent actions on shaded nodes
        return;
    }

    // drag child sub-tree
    const descendants = getDescendants(node);

    // start dragging
    return view('update-graph', {
        drag: {
            active: true,
            node,
            nodes: [node, ...descendants],

            startX: node.posAbs.x,
            startY: node.posAbs.y
        }
    });
}