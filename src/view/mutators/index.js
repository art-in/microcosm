import React from 'react';
import ReactDom from 'react-dom';

import required from 'utils/required-params';
import MutationType from 'utils/state/Mutation';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import Main from 'view/main/Main';
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

    const {graph} = state.vm.main.mindmap;
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

    case 'update-graph':
    case 'update-mindmap':
    case 'add-association':
    case 'add-idea':
    case 'remove-idea':
    case 'remove-association':
    case 'update-idea':
    case 'update-association':
    case 'update-node': // TODO: update only node and related links
        graph.emit('change');
        break;
    
    case 'update-link': {
        const link = graph.links.find(l => l.id === data.id);
        link.emit('change');
        break;
    }

    case 'update-association-tails-lookup':
        graph.associationTailsLookup.emit('change');
        break;

    case 'update-color-picker':
        graph.colorPicker.emit('change');
        break;

    case 'update-context-menu':
        graph.contextMenu.emit('change');
        break;

    default: throw Error(`Unknown mutation '${mutation.type}'`);
    }
}

/**
 * Mounts component tree
 * @param {StateType} state
 */
function mount(state) {
    ReactDom.render(
        // @ts-ignore
        <Provider dispatch={state.view.storeDispatch}>
            <Main vm={state.vm.main} />
        </Provider>,
        state.view.root);
}