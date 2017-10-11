import React from 'react';
import ReactDom from 'react-dom';

import Main from 'view/main/Main';

/**
 * Applies patch to view state
 * @param {object} state
 * @param {Patch} patch
 */
export default function mutate(state, patch) {
    
    if ([...patch].some(m => !m.hasTarget('view'))) {
        // do not apply patch if some mutations
        // do not target view layer
        return;
    }

    if (patch['init']) {
        state.view.root = patch['init'][0].data.view.root;
    }

    // always re-map from viewmodel
    // react will do all clever patches on view
    ReactDom.render(<Main vm={state.vm.main} />,
        state.view.root);
}