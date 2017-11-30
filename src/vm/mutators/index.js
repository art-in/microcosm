import regMutatorsFolder from 'utils/reg-mutators-folder';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import defaultMutator from './default';

// eslint-disable-next-line no-undef
const context = require.context('.', true, /\.js$/);
const mutators = regMutatorsFolder(context);

/**
 * Applies patch to vm state
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default function mutate(state, patch) {
    patch
        .filter(m => m.hasTarget('vm'))
        .forEach(m => {
            const {type, data} = m;
            if (mutators[type]) {
                mutators[type](state, data);
            } else {
                // TODO: do not apply default mutation several times
                defaultMutator(state);
            }
        });
}