import clone from 'clone';

import required from 'utils/required-params';

import StateType from 'boot/client/State';

import MindmapType from 'vm/map/entities/Mindmap';
import Point from 'model/entities/Point';
import ViewMode from 'vm/main/MindsetViewMode';
import getMindmapFocusNode from 'vm/map/utils/get-mindmap-focus-node';
import view from 'vm/utils/view-patch';
import MindsetType from 'model/entities/Mindset';
import computePositionAndSize from 'vm/map/entities/Viewbox/methods/compute-position-and-size';

/**
 * Handles keydown event from mindset
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.code
 * @param {boolean} data.ctrlKey - 'control' key is pressed
 * @param {function} data.preventDefault
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
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
        await onMindmapPan({code, mindmap, dispatch, mutate});
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

          case ViewMode.zen:
            if (mindset.zen.pane.form.isSaveable) {
              dispatch({type: 'on-zen-idea-form-save'});
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
      // in zen mode, only allow default search box, since idea form is always
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
      // in zen mode, do not override default action at all, since idea form is
      // always shown there.
      if (mindset.mode === ViewMode.mindmap && !isMindmapPopupActive) {
        dispatch({type: 'on-mindset-go-root-button-click'});
      }
      break;

    case 'KeyM': // Ctrl+M
      if (ctrlKey) {
        dispatch({type: 'on-mindset-toggle-mode'});
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
 * @param {function} opts.mutate
 */
async function onMindmapPan(opts) {
  const {code, mindmap, dispatch, mutate} = opts;

  let panKeyStep = 40;

  panKeyStep /= mindmap.viewbox.scale;

  const pos = clone(mindmap.viewbox.center);

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

  await mutate(
    view('update-mindmap', {
      viewbox: computePositionAndSize({
        viewport: mindmap.viewport,
        center: pos,
        scale: mindmap.viewbox.scale
      })
    })
  );

  dispatch({
    type: 'set-mindset-focus-idea',
    data: {ideaId: getMindmapFocusNode(mindmap)}
  });
}
