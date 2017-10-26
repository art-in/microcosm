import regMutatorsFolder from 'utils/reg-mutators-folder';

import defaultMutator from './default';

// eslint-disable-next-line no-undef
const context = require.context('.', true, /\.js$/);
const mutators = regMutatorsFolder(context);

/**
 * Applies patch to vm state
 * @param {object} state
 * @param {Patch} patch
 */
export default function mutate(state, patch) {
    for (const mutation of patch) {
        if (mutation.hasTarget('vm')) {
            const {type, data} = mutation;
            if (mutators[type]) {
                mutators[type](state, data);
            } else {
                // TODO: do not apply default mutation several times
                defaultMutator(state, data);
            }
        }
    }
}