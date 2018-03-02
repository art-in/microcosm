import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';
import MainScreen from 'vm/main/MainScreen';
import openScreen from 'vm/main/Main/methods/open-screen';
import authenticate from 'vm/action/utils/auth/authenticate';

/**
 * Handles login event from login form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 * @return {Promise.<PatchType>}
 */
export default async function(state, data, dispatch, mutate) {
  const {sessionDbServerUrl} = state.params;
  const {loginForm} = state.vm.main.auth;

  await mutate(
    view('update-auth-screen', {
      loginForm: {loginButton: {enabled: false, content: 'Logging in...'}}
    })
  );

  const response = await authenticate(
    sessionDbServerUrl,
    loginForm.username,
    loginForm.password,
    state.sideEffects.fetch
  );

  if (response.ok) {
    // login succeed
    await mutate(view('update-main', openScreen(MainScreen.mindset)));

    dispatch({
      type: 'load-mindset',
      data: {
        isInitialLoad: true,
        sessionDbServerUrl,
        sessionUserName: loginForm.username
      }
    });
  } else {
    // login failed
    let message;
    let isUsernameValid = true;
    let isPasswordValid = true;

    if (!response.isConnected) {
      message = 'Unable to connect to server. Contact the administrator.';
    } else {
      switch (response.error) {
        case 'unauthorized':
          message = 'Invalid username or password.';
          isUsernameValid = false;
          isPasswordValid = false;
          break;
        default: {
          const err = response.error;
          message = `Unknown error (${err}). Contact the administrator.`;
        }
      }
    }

    return view('update-auth-screen', {
      loginForm: {
        isUsernameValid,
        isPasswordValid,
        errorNotification: {visible: true, message},
        loginButton: {enabled: true, content: 'Log in'}
      }
    });
  }
}
