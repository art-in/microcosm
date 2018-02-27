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

  await mutate(view('update-auth-login-form', {loginError: {visible: false}}));

  const response = await loginDbServer(
    sessionDbServerUrl,
    loginForm.name,
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
        sessionUserName: loginForm.name
      }
    });
  } else {
    // login failed
    return view('update-auth-login-form', {
      loginError: {visible: true, message: `Login failed: ${response.reason}`}
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
 * @return {Promise.<{ok:boolean, error, reason}>} database server response
 */
async function loginDbServer(dbServerUrl, name, password, fetch) {
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

  return response;
}
