import React from 'react';
import ReactDom from 'react-dom';

import Main from 'ui/views/Main';

/**
 * Applies patch to viewmodel state
 * @param {object} state
 * @param {Patch} patch
 * @return {object} new view state
 */
export default async function mutate(state, patch) {
    
    await Promise.all(patch.map(async function(mutation) {
        state.view = await apply(state, mutation);
    }));

    return state.view;
}

/**
 * Applies single mutation to state
 * @param {object} state
 * @param {{type, data}} mutation
 * @return {object} new view state
 */
async function apply(state, mutation) {

    switch(mutation.type) {
    case 'init':
        state.view.root = mutation.data.view.root;
        break;
    }

    ReactDom.render(<Main vm={state.vm.main} />,
        state.view.root);

    return state.view;
}