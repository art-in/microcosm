import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

/**
 * Handles mouse down event on graph node
 * 
 * @param {object} state
 * @param {object} data
 * @param {Node}   data.node
 * @param {string} data.button
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {node, button} = required(data);
    
    if (button !== 'left') {
        // left button only
        return;
    }

    if (node.shaded) {
        // prevent actions on shaded nodes
        return;
    }

    // start dragging
    return view('update-graph', {
        drag: {
            active: true,
            node: node,
            startX: node.pos.x,
            startY: node.pos.y
        }
    });
}