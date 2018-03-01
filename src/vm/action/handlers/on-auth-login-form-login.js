import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';
import MainScreen from 'vm/main/MainScreen';
import openScreen from 'vm/main/Main/methods/open-screen';

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
  const {sessionDbServerUrl} = state.data;
  const {loginForm} = state.vm.main.auth;

  await mutate(
    view('update-auth-login-form', {
      loginButton: {enabled: false, content: 'Logging in...'}
    })
  );

  const response = await loginDbServer(
    sessionDbServerUrl,
    loginForm.name.value,
    loginForm.password.value,
    state.sideEffects.fetch
  );

  if (response.ok) {
    await mutate(view('update-main', openScreen(MainScreen.mindset)));

    dispatch({
      type: 'load-mindset',
      data: {
        isInitialLoad: true,
        sessionDbServerUrl,
        sessionUserName: loginForm.name.value
      }
    });
  } else if (!response.isConnected) {
    return view('update-auth-login-form', {
      errorNotification: {
        visible: true,
        message: 'Unable to connect to server.'
      },
      loginButton: {enabled: true, content: 'Log in'}
    });
  } else {
    return view('update-auth-login-form', {
      name: {isInvalid: true},
      password: {isInvalid: true},
      errorNotification: {
        visible: true,
        message: 'Invalid username or password.'
      },
      loginButton: {enabled: true, content: 'Log in'}
    });
  }
}

/**
 * Tries to authenticate user for accessing database server.
 *
 * In case user name and password are authentic, database server will return
 * cookie with session key. Browser will be sending that cookie with all
 * subsequent requests to databases, so entire session will be authenticated.
 *
 * @param {string} dbServerUrl
 * @param {string} name
 * @param {string} password
 * @param {function(RequestInfo, RequestInit): Promise<Response>} fetch
 *
 * @typedef {object} LoginResult
 * @prop {boolean} [ok=false] - login succeed
 * @prop {string} [error] - error code
 * @prop {boolean} isConnected - connected to database server
 * @return {Promise.<LoginResult>}
 */
async function loginDbServer(dbServerUrl, name, password, fetch) {
  try {
    const res = await fetch(`${dbServerUrl}/_session`, {
      method: 'POST',
      headers: {
        ['Accept']: 'application/json',
        ['Content-Type']: 'application/json'
      },
      // allow server to set cookies for another origin
      credentials: 'include',
      body: JSON.stringify({name, password})
    });
    const response = await res.json();

    response.isConnected = true;

    return response;
  } catch (error) {
    // db server not reachable (offline, db shutted down, etc)
    return {isConnected: false};
  }
}
