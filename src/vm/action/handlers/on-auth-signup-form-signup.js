import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';
import authorize from 'vm/action/utils/auth/authorize';
import ApiErrorCode from 'boot/server/utils/ApiErrorCode';
import LoginForm from 'vm/auth/LoginForm';
import AuthScreenMode from 'vm/auth/AuthScreenMode';

/**
 * Handles signup event from signup form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 * @return {Promise.<PatchType>}
 */
export default async function(state, data, dispatch, mutate) {
  const {apiServerUrl} = state.params;
  const {signupForm} = state.vm.main.auth;

  await mutate(
    view('update-auth-screen', {
      signupForm: {signupButton: {enabled: false, content: 'Signing up...'}}
    })
  );

  const response = await authorize(
    apiServerUrl,
    signupForm.invite,
    signupForm.username,
    signupForm.password,
    state.sideEffects.fetch
  );

  if (response.ok) {
    // signup succeed
    await mutate(
      view('update-auth-screen', {
        mode: AuthScreenMode.login,
        signupForm: null,
        loginForm: new LoginForm({
          username: signupForm.username,
          password: signupForm.password
        })
      })
    );

    dispatch({type: 'on-auth-login-form-login'});
  } else {
    // signup failed
    let message;
    let isInviteValid = true;
    let isUsernameValid = true;
    let isPasswordValid = true;

    if (!response.isConnected) {
      message = 'Unable to connect to server. Contact the administrator.';
    } else {
      switch (response.error) {
        case ApiErrorCode.internalError:
          message = 'Internal server error. Contact the administrator.';
          break;
        case ApiErrorCode.invalidInviteCode:
          message = 'Invalid invite code.';
          isInviteValid = false;
          break;
        case ApiErrorCode.emptyUserName:
          message = 'Empty user name.';
          isUsernameValid = false;
          break;
        case ApiErrorCode.duplicateUserName:
          message = 'User with such name already exists.';
          isUsernameValid = false;
          break;
        case ApiErrorCode.weakPassword:
          message = 'Password is too weak.';
          isPasswordValid = false;
          break;
        default: {
          const err = response.error;
          message = `Unknown error (${err}). Contact the administrator.`;
        }
      }
    }

    return view('update-auth-screen', {
      signupForm: {
        isInviteValid,
        isUsernameValid,
        isPasswordValid,
        errorNotification: {visible: true, message},
        signupButton: {enabled: true, content: 'Sign up'}
      }
    });
  }
}
