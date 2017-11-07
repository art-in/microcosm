import required from 'utils/required-params';

import Point from 'model/entities/Point';

/**
 * Handles key press event on graph
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.key
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {key} = required(data);
    
    let panKeyStep = 20;

    panKeyStep /= graph.viewbox.scale;

    const pos = new Point({x: graph.viewbox.x, y: graph.viewbox.y});
    let moved = false;

    switch (key) {
    case 'ArrowDown':
        pos.y = pos.y + panKeyStep;
        moved = true;
        break;
    case 'ArrowUp':
        pos.y = pos.y - panKeyStep;
        moved = true;
        break;
    case 'ArrowLeft':
        pos.x = pos.x - panKeyStep;
        moved = true;
        break;
    case 'ArrowRight':
        pos.x = pos.x + panKeyStep;
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