import React from 'react';
import ReactDom from 'react-dom';
import required from 'utils/required-params';

import Main from 'view/main/Main';
import Provider from 'view/utils/connect/Provider';

/**
 * Applies patch to view state
 * @param {object} state
 * @param {Patch} patch
 */
export default function mutate(state, patch) {
    
    if ([...patch].some(m => !m.hasTarget('view'))) {
        // do not apply patch if some mutations
        // not targeting view layer
        return;
    }

    if (patch['init']) {
        const mutation = patch['init'][0];
        const {root, storeDispatch} = required(mutation.data.view);

        state.view.root = root;
        state.view.storeDispatch = storeDispatch;
    }

    // eslint-disable-next-line require-jsdoc
    const render = () => {
        // always re-map from viewmodel
        // react will do all clever patches on view
        ReactDom.render(
            <Provider dispatch={state.view.storeDispatch}>
                <Main vm={state.vm.main} />
            </Provider>,
            state.view.root);
    };

    render();

    // webpack hot module replacement
    /* eslint-disable no-undef */
    if (module.hot) {
        module.hot.accept('view/main/Main', () => render());
    }
}