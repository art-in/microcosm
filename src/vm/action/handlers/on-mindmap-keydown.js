import required from 'utils/required-params';

import StateType from 'boot/client/State';

import GraphType from 'vm/map/entities/Graph';
import Point from 'model/entities/Point';

/**
 * Handles keydown event from mindmap
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.key
 * @param {boolean} data.ctrlKey - 'control' key is pressed
 * @param {function} data.preventDefault
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap}}} = state;
    const {graph} = mindmap;
    const {key, ctrlKey, preventDefault} = required(data);
    
    switch (key) {

    case 'Escape':
        dispatch({type: 'deactivate-popups'});
        break;

    case 'ArrowDown':
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'ArrowRight':
        onMindmapPan({key, graph, dispatch});
        break;
    
    // TODO: zoom on PageUp/PageDown

    case 'f':
    case 'F':
        // allow default browser search box only in case idea form opened
        // to search on idea contents, otherwise if graph shown default search
        // will not be effective - use custom search box for searching ideas
        if (ctrlKey && !graph.ideaFormModal.modal.active) {
            dispatch({type: 'activate-idea-search-box'});
            preventDefault();
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
        type: 'set-mindmap-position-and-scale',
        data: {
            mindmapId: graph.id,
            pos
        }
    });
}