import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import AuthScreenType from 'vm/auth/AuthScreen';

/**
 * Updates auth screen
 *
 * @param {StateType} state
 * @param {Partial<AuthScreenType>} data
 */
export default function updateAuthScreen(state, data) {
  const {auth} = state.vm.main;

  updateViewModel(auth, data);
}
