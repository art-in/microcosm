import required from 'utils/required-params';

import StateType from 'boot/client/State';

import GraphType from 'vm/map/entities/Graph';
import Point from 'model/entities/Point';

/**
 * Handles keydown event from mindmap
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.code
 * @param {boolean} data.ctrlKey - 'control' key is pressed
 * @param {function} data.preventDefault
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap}}} = state;
    const {graph} = mindmap;
    const {code, ctrlKey, preventDefault} = required(data);
    
    const isPopupActive =
        graph.associationTailsLookup.active ||
        mindmap.ideaSearchBox.active ||
        graph.ideaFormModal.modal.active;

    switch (code) {

    case 'Escape':
        dispatch({type: 'deactivate-popups'});
        break;

    case 'ArrowDown':
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'ArrowRight':
        if (!isPopupActive) {
            onMindmapPan({code, graph, dispatch});
        }
        break;
    
    case 'PageUp':
    case 'PageDown':
        if (!isPopupActive) {
            dispatch({
                type: 'animate-graph-zoom',
                data: {
                    up: code === 'PageUp' ? true : false,
                    // zoom into center of viewport
                    pos: new Point({
                        x: graph.viewport.width / 2,
                        y: graph.viewport.height / 2
                    })
                }
            });
        }
        break;

    // TODO: save form with Ctrl+Enter
    
    case 'KeyF':
        // allow default browser search box only in case idea form opened,
        // to search on idea contents, otherwise if graph shown default search
        // will not be effective - use custom search box for searching ideas
        if (!isPopupActive && ctrlKey) {
            dispatch({type: 'activate-idea-search-box'});
            preventDefault();
        }
        break;
    
    case 'Home':
        if (!isPopupActive) {
            dispatch({type: 'on-go-root-button-click'});
        }
        break;

    default:
        // skip
    }
}

/**
 * Handles mindmap panning with keyboard
 * 
 * @param {object} opts
 * @param {string} opts.code
 * @param {GraphType} opts.graph
 * @param {function} opts.dispatch
 */
function onMindmapPan(opts) {
    const {code, graph, dispatch} = opts;

    let panKeyStep = 20;
    
    panKeyStep /= graph.viewbox.scale;

    const pos = new Point({
        x: graph.viewbox.x,
        y: graph.viewbox.y
    });

    switch (code) {
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