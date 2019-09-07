import regMutatorsFolder from 'utils/reg-mutators-folder';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

// eslint-disable-next-line no-undef
const context = require.context('.', true, /\.js$/);
const mutators = regMutatorsFolder(context);

/**
 * Applies patch to model state
 *
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default function mutate(state, patch) {
  patch
    .filter(m => m.hasTarget('model'))
    .forEach(m => {
      const {type, data} = m;
      if (!mutators[type]) {
        throw Error(`Unknown model mutation '${type}'`);
      }
      mutators[type](state, data);
    });
}
