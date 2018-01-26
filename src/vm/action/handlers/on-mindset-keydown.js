import required from 'utils/required-params';

import StateType from 'boot/client/State';

import MindmapType from 'vm/map/entities/Mindmap';
import Point from 'model/entities/Point';
import ViewMode from 'vm/main/MindsetViewMode';

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
  const {code, ctrlKey, preventDefault} = required(data);

  if (!mindset.isLoaded) {
    return;
  }

  let mindmap;
  let isMindmapPopupActive;
  if (mindset.mode === ViewMode.mindmap) {
    mindmap = mindset.mindmap;
    isMindmapPopupActive =
      mindset.mindmap.associationTailsLookup.active ||
      mindset.ideaSearchBox.active ||
      mindset.mindmap.ideaFormModal.modal.active;
  }

  switch (code) {
    case 'Escape':
      if (mindset.mode === ViewMode.mindmap) {
        dispatch({type: 'deactivate-popups'});
      }
      break;

    case 'ArrowDown':
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'ArrowRight':
      if (mindset.mode === ViewMode.mindmap && !isMindmapPopupActive) {
        onMindmapPan({code, mindmap, dispatch});
      }
      break;

    case 'PageUp':
    case 'PageDown':
      if (mindset.mode === ViewMode.mindmap && !isMindmapPopupActive) {
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

    case 'Enter': // Ctrl+Enter
      if (ctrlKey) {
        switch (mindset.mode) {
          case ViewMode.mindmap:
            if (mindmap.ideaFormModal.form.isSaveable) {
              dispatch({type: 'on-idea-form-modal-save'});
            }
            break;

          case ViewMode.list:
            if (mindset.list.pane.form.isSaveable) {
              dispatch({type: 'on-mindlist-idea-form-save'});
            }
            break;
        }
      }
      break;

    case 'KeyF': // Ctrl+F
      // in mindmap mode, allow default browser search box only in case idea
      // form opened to search on idea text contents, otherwise if mindmap
      // shown, default search will not be effective - use custom box for
      // searching ideas.
      // in list mode, only allow default search box, since idea form is always
      // shown there.
      if (
        ctrlKey &&
        mindset.mode === ViewMode.mindmap &&
        !isMindmapPopupActive
      ) {
        dispatch({type: 'activate-idea-search-box'});
        preventDefault();
      }
      break;

    case 'Home':
      // in mindmap mode, allow to move to root idea by home button only if no
      // text popup is shown, otherwise it will conflict with text editing
      // action 'move carret to line start'.
      // in list mode, do not override default action at all, since idea form is
      // always shown there.
      if (mindset.mode === ViewMode.mindmap && !isMindmapPopupActive) {
        dispatch({type: 'on-mindset-go-root-button-click'});
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
 * @param {MindmapType} opts.mindmap
 * @param {function} opts.dispatch
 */
function onMindmapPan(opts) {
  const {code, mindmap, dispatch} = opts;

  let panKeyStep = 40;

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
