import databaseMutator from './database';
import localMutator from './local';

import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';

/**
 * Applies patch to data state
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default async function mutate(state, patch) {
  await localMutator(state, patch);
  await databaseMutator(state, patch);
}
