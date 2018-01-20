import React from 'react';
import ReactDom from 'react-dom';

import required from 'utils/required-params';
import MutationType from 'utils/state/Mutation';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import Main, {rootClass} from 'view/main/Main';
import Provider from 'view/utils/connect/Provider';

/**
 * Applies patch to view state
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default function mutate(state, patch) {
    patch
        .filter(m => m.hasTarget('view'))
        .forEach(m => apply(state, m));
}

/**
 * Applies single mutation to state
 * @param {StateType} state
 * @param {MutationType} mutation
 */
function apply(state, mutation) {

    const {mindset} = state.vm.main;
    const {mindmap} = mindset;
    
    const {data} = mutation;

    switch (mutation.type) {
    
    case 'init': {
        const {root, storeDispatch} = required(data.view);
        
        state.view.root = root;
        state.view.storeDispatch = storeDispatch;

        mount(state);

        // register webpack hot module replacement
        /* eslint-disable no-undef */
        if (module.hot) {
            module.hot.accept('view/main/Main', () => mount(state));
        }
        break;
    }

    case 'init-mindset':
    case 'update-mindset-vm':
        state.vm.main.mindset.emitChange();
        break;

    case 'update-mindmap':
    case 'update-mindset':
    case 'add-association':
    case 'add-idea':
    case 'remove-idea':
    case 'remove-association':
    case 'update-idea':
    case 'update-association':
    case 'update-node': // TODO: update only node and related links
        mindmap.emitChange();
        break;
    
    case 'update-link': {
        const link = mindmap.links.find(l => l.id === data.id);
        link.emitChange();
        break;
    }

    case 'update-association-tails-lookup':
        mindmap.associationTailsLookup.emitChange();
        break;

    case 'update-color-picker':
        mindmap.colorPicker.emitChange();
        break;

    case 'update-context-menu':
        mindmap.contextMenu.emitChange();
        break;

    case 'update-idea-search-box':
        mindset.ideaSearchBox.emitChange();
        break;

    case 'update-idea-form-modal':
        mindmap.ideaFormModal.emitChange();
        break;

    case 'update-idea-form-successor-search-box':
        mindmap.ideaFormModal.form.successorSearchBox.emitChange();
        break;

    default: throw Error(`Unknown view mutation '${mutation.type}'`);
    }
}

/**
 * Mounts component tree
 * @param {StateType} state
 */
function mount(state) {
    state.view.root.classList.add(rootClass);
    ReactDom.render(
        <Provider dispatch={state.view.storeDispatch}>
            <Main main={state.vm.main} />
        </Provider>,
        state.view.root);
}