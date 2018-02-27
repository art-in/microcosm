import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import LoginFormType from 'vm/auth/LoginForm';

/**
 * Updates login form
 *
 * @param {StateType} state
 * @param {Partial<LoginFormType>} data
 */
export default function updateAuthLoginForm(state, data) {
  const {loginForm} = state.vm.main.auth;

  updateViewModel(loginForm, data);
}
