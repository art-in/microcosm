import required from 'utils/required-params';

import Point from 'vm/shared/Point';

/**
 * Handles key press event on graph
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.keyCode
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {keyCode} = required(data);
    
    let panKeyStep = 20;

    panKeyStep /= graph.viewbox.scale;

    const pos = new Point(graph.viewbox.x, graph.viewbox.y);
    let moved = false;

    switch (keyCode) {
    case 'ArrowDown':
        pos.y = pos.y - panKeyStep;
        moved = true;
        break;
    case 'ArrowUp':
        pos.y = pos.y + panKeyStep;
        moved = true;
        break;
    case 'ArrowLeft':
        pos.x = pos.x + panKeyStep;
        moved = true;
        break;
    case 'ArrowRight':
        pos.x = pos.x - panKeyStep;
        moved = true;
        break;
    default:
        // skip
    }

    if (moved) {
        dispatch({
            type: 'set-mindmap-position',
            data: {
                mindmapId: graph.id,
                pos
            }
        });
    }
}