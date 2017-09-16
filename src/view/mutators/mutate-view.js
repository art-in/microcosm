import React from 'react';
import ReactDom from 'react-dom';

import Main from 'view/main/Main';

/**
 * Applies patch to view state
 * @param {object} state
 * @param {Patch} patch
 * @return {object} new state
 */
export default async function mutate(state, patch) {
    
    let newState = state;

    await Promise.all(patch.map(async function(mutation) {
        newState = await apply(newState, mutation);
    }));

    return newState;
}

/**
 * Applies single mutation to state
 * @param {object} state
 * @param {{type, data}} mutation
 * @return {object} new state
 */
async function apply(state, mutation) {

    switch (mutation.type) {
    case 'init':
        state.view.root = mutation.data.view.root;
        break;
    }

    // TODO: render once on entire patch, not on each mutations

    // always re-map from viewmodel
    // react will do all clever patches on view
    ReactDom.render(<Main vm={state.vm.main} />,
        state.view.root);

    return state;
}