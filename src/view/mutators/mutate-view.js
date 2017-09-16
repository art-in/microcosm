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
    
    if (patch['init']) {
        state.view.root = patch['init'][0].view.root;
    }

    // always re-map from viewmodel
    // react will do all clever patches on view
    ReactDom.render(<Main vm={state.vm.main} />,
        state.view.root);

    return state;
}