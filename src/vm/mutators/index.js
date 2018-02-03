import regMutatorsFolder from 'utils/reg-mutators-folder';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import defaultMutator from './default';

// eslint-disable-next-line no-undef
const context = require.context('.', true, /\.js$/);
const mutators = regMutatorsFolder(context);

/**
 * Applies patch to vm state
 *
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default function mutate(state, patch) {
  let prevDefault = false;
  patch.filter(m => m.hasTarget('vm')).forEach(m => {
    const {type, data} = m;
    if (mutators[type]) {
      mutators[type](state, data);
      prevDefault = false;
    } else if (!prevDefault) {
      // do not run default mutator several times in a row
      defaultMutator(state);
      prevDefault = true;
    }
  });
}
