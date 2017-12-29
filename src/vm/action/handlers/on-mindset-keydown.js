import required from 'utils/required-params';

import StateType from 'boot/client/State';

import MindmapType from 'vm/map/entities/Mindmap';
import Point from 'model/entities/Point';

/**
 * Handles keydown event from mindset
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.code
 * @param {boolean} data.ctrlKey - 'control' key is pressed
 * @param {function} data.preventDefault
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindset}}} = state;
    const {mindmap} = mindset;
    const {code, ctrlKey, preventDefault} = required(data);
    
    // TODO: fails to access mindmap on loading screen 

    const isPopupActive =
        mindmap.associationTailsLookup.active ||
        mindset.ideaSearchBox.active ||
        mindmap.ideaFormModal.modal.active;

    switch (code) {

    case 'Escape':
        dispatch({type: 'deactivate-popups'});
        break;

    case 'ArrowDown':
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'ArrowRight':
        if (!isPopupActive) {
            onMindmapPan({code, mindmap, dispatch});
        }
        break;
    
    case 'PageUp':
    case 'PageDown':
        if (!isPopupActive) {
            dispatch({
                type: 'animate-mindmap-zoom',
                data: {
                    up: code === 'PageUp' ? true : false,
                    // zoom into center of viewport
                    viewportPos: new Point({
                        x: mindmap.viewport.width / 2,
                        y: mindmap.viewport.height / 2
                    })
                }
            });
        }
        break;

    case 'Enter':
        if (ctrlKey && mindmap.ideaFormModal.modal.active) {
            dispatch({type: 'on-idea-form-modal-save'});
        }
        break;
    
    case 'KeyF':
        // allow default browser search box only in case idea form opened
        // to search on idea contents, otherwise if mindmap shown, default
        // search will not be effective - use custom box for searching ideas
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
 * Handles mindset panning with keyboard
 * 
 * @param {object} opts
 * @param {string} opts.code
 * @param {MindmapType} opts.mindmap
 * @param {function} opts.dispatch
 */
function onMindmapPan(opts) {
    const {code, mindmap, dispatch} = opts;

    let panKeyStep = 20;
    
    panKeyStep /= mindmap.viewbox.scale;

    const pos = new Point({
        x: mindmap.viewbox.x,
        y: mindmap.viewbox.y
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
        type: 'set-mindset-position-and-scale',
        data: {
            mindsetId: mindmap.id,
            pos
        }
    });
}