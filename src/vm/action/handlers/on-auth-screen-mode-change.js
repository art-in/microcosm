import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import AuthScreenMode from 'vm/auth/AuthScreenMode';
import SignupForm from 'vm/auth/SignupForm';
import LoginForm from 'vm/auth/LoginForm';

/**
 * Handles mode change event from auth screen
 *
 * @param {StateType} state
 * @param {object} data
 * @param {AuthScreenMode} data.mode
 * @return {PatchType}
 */
export default function(state, data) {
  const {clientConfig} = state.params;
  const {mode} = required(data);

  switch (mode) {
    case AuthScreenMode.signup:
      return view('update-auth-screen', {
        mode,
        signupForm: new SignupForm({
          isInviteVisible: clientConfig.signupInviteRequired
        }),
        loginForm: null
      });

    case AuthScreenMode.login:
      return view('update-auth-screen', {
        mode,
        signupForm: null,
        loginForm: new LoginForm()
      });

    default:
      throw Error(`Unknown auth screen mode '${mode}'`);
  }
}
