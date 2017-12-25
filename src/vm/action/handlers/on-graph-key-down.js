import required from 'utils/required-params';

import StateType from 'boot/client/State';

import GraphType from 'vm/map/entities/Graph';
import Point from 'model/entities/Point';

/**
 * Handles key down event on graph
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.key
 * @param {boolean} data.ctrlKey - 'control' key is pressed
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {key, ctrlKey} = required(data);
    
    if (key === 'Escape') {
        dispatch({type: 'deactivate-popups'});
    } else
    if (graph.associationTailsLookup.popup.active ||
        graph.ideaSearchBox.active) {
        // do not handle key on graph if some another input is active.
        // Q: why not stop propagation of key event right for those inputs?
        // A: because that would require preventing default behavior for
        //    'ctrl+f' in all those places instead of once in graph view.
        //    let action to decide keyboard priorities.
        return;
    }

    switch (key) {

    case 'ArrowDown':
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'ArrowRight':
        onMindmapPan({key, graph, dispatch});
        break;
    
    case 'f':
    case 'F':
        if (ctrlKey) {
            dispatch({type: 'activate-idea-search-box'});
        }
        break;
    
    case 'Home':
        dispatch({type: 'on-go-root-button-click'});
        break;

    default:
        // skip
    }
}

/**
 * Handles mindmap panning with keyboard
 * 
 * @param {object} opts
 * @param {string} opts.key
 * @param {GraphType} opts.graph
 * @param {function} opts.dispatch
 */
function onMindmapPan(opts) {
    const {key, graph, dispatch} = opts;

    let panKeyStep = 20;
    
    panKeyStep /= graph.viewbox.scale;

    const pos = new Point({
        x: graph.viewbox.x,
        y: graph.viewbox.y
    });

    switch (key) {
    case 'ArrowDown':
        pos.y = pos.y + panKeyStep;
        break;
    case 'ArrowUp':
        pos.y = pos.y - panKeyStep;
        break;
    case 'ArrowLeft':
        pos.x = pos.x - panKeyStep;
        break;
    case 'ArrowRight':
        pos.x = pos.x + panKeyStep;
        break;
    }

    dispatch({
        type: 'set-mindmap-position',
        data: {
            mindmapId: graph.id,
            pos
        }
    });
}