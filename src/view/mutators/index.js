import React from 'react';
import ReactDom from 'react-dom';

import required from 'utils/required-params';
import MutationType from 'utils/state/Mutation';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import Main, {rootClass} from 'view/main/Main';
import Provider from 'view/utils/connect/Provider';
import MindsetViewMode from 'vm/main/MindsetViewMode';

/**
 * Applies patch to view state
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default function mutate(state, patch) {
  patch.filter(m => m.hasTarget('view')).forEach(m => apply(state, m));
}

/**
 * Applies single mutation to state
 * @param {StateType} state
 * @param {MutationType} mutation
 */
function apply(state, mutation) {
  const {mindset, auth} = state.vm.main;

  const {data} = mutation;

  switch (mutation.type) {
    case 'init': {
      const {root, storeDispatch} = required(data.view);

      state.view.root = root;
      state.view.storeDispatch = storeDispatch;

      state.view.root.classList.add(rootClass);
      ReactDom.render(
        <Provider dispatch={state.view.storeDispatch}>
          <Main main={state.vm.main} />
        </Provider>,
        state.view.root
      );
      break;
    }

    case 'update-main':
      state.vm.main.emitChange();
      break;

    case 'update-auth-screen':
      auth.emitChange();
      break;

    case 'init-mindset':
    case 'update-mindset-vm':
      state.vm.main.mindset.emitChange();
      break;

    case 'update-mindmap':
      mindset.mindmap.emitChange();
      break;

    case 'update-mindset':
    case 'add-association':
    case 'add-idea':
    case 'remove-idea':
    case 'remove-association':
    case 'update-idea':
    case 'update-association':
    case 'update-node': // TODO: update only node and related links
      if (mindset.mode === MindsetViewMode.mindmap) {
        mindset.mindmap.emitChange();
      }
      break;

    case 'update-link': {
      const link = mindset.mindmap.links.find(l => l.id === data.id);
      link.emitChange();
      break;
    }

    case 'update-association-tails-lookup':
      mindset.mindmap.associationTailsLookup.emitChange();
      break;

    case 'update-color-picker':
      mindset.colorPicker.emitChange();
      break;

    case 'update-context-menu':
      mindset.mindmap.contextMenu.emitChange();
      break;

    case 'update-idea-search-box':
      mindset.ideaSearchBox.emitChange();
      break;

    case 'update-idea-form-modal':
      mindset.mindmap.ideaFormModal.emitChange();
      break;

    case 'update-idea-form-successor-search-box':
      mindset.mindmap.ideaFormModal.form.successorSearchBox.emitChange();
      break;

    case 'update-zen':
      mindset.zen.emitChange();
      break;

    case 'update-zen-pane':
      mindset.zen.pane.emitChange();
      break;

    case 'update-zen-sidebar':
      mindset.zen.sidebar.emitChange();
      break;

    case 'update-zen-idea-form-successor-search-box':
      mindset.zen.pane.form.successorSearchBox.emitChange();
      break;

    case 'update-db-connection':
      mindset.dbConnectionIcon.emitChange();
      break;

    case 'update-import-form':
      mindset.importFormModal.emitChange();
      break;

    default:
      throw Error(`Unknown view mutation '${mutation.type}'`);
  }
}
