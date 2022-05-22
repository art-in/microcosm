import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';
import ClientConfigType from 'boot/client/ClientConfig';

import view from 'vm/utils/view-patch';
import ConnectionState from 'action/utils/ConnectionState';
import getDbConnectionState from 'action/utils/get-db-connection-state';
import MainVM from 'vm/main/Main';
import VersionVM from 'vm/main/Version';
import MainScreen from 'vm/main/MainScreen';
import openScreen from 'vm/main/Main/methods/open-screen';
import AuthScreenMode from 'vm/auth/AuthScreenMode';
import LoginForm from 'vm/auth/LoginForm';

/**
 * Inits state on app start
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function(RequestInfo, RequestInit): Promise<Response>} data.fetch
 * @param {function} data.setTimeout
 * @param {function} data.confirm
 * @param {function} data.reload
 * @param {ClientConfigType} data.clientConfig
 * @param {string} data.apiServerUrl
 * @param {string} data.sessionDbServerUrl
 * @param {function} data.storeDispatch
 * @param {Element} data.viewRoot
 * @param {string} [data.userName]
 * @param {string} [data.userPassword]
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function init(state, data, dispatch, mutate) {
  const {
    fetch,
    setTimeout,
    confirm,
    reload,
    clientConfig,
    apiServerUrl,
    storeDispatch,
    viewRoot
  } = required(data);

  const {userName, userPassword} = data;

  await mutate(new Patch({type: 'init-local-data', targets: ['data']}));

  // init view model
  const main = new MainVM({
    screen: MainScreen.loading,
    version: new VersionVM({
      name: clientConfig.app.name,
      homepage: clientConfig.app.homepage,
      version: clientConfig.app.version
    })
  });

  const {protocol, host, port, path} = clientConfig.dbServer;
  const sessionDbServerUrl = `${protocol}://${host}:${port}/${path}`;

  await mutate(
    new Patch({
      type: 'init',
      data: {
        sideEffects: {fetch, setTimeout, confirm, reload},
        params: {clientConfig, sessionDbServerUrl, apiServerUrl},
        vm: {main},
        view: {root: viewRoot, storeDispatch}
      }
    })
  );

  const {
    userName: lastUserName,
    isDbAuthorized,
    dbServerUrl: lastDbServerUrl
  } = state.data;

  let shouldLogin;

  if (userName && userPassword) {
    // force login if user credentials are explicitly provided
    shouldLogin = true;
  } else if (!lastDbServerUrl) {
    // force login form on first visit
    shouldLogin = true;
  } else if (!isDbAuthorized) {
    // force login form if last connection was not authorized.
    // ensure db server is reachable, otherwise we will not be able to
    // authenticate user without db server
    const connectionState = await getDbConnectionState(
      lastDbServerUrl,
      lastUserName,
      state.sideEffects.fetch
    );

    shouldLogin = connectionState !== ConnectionState.disconnected;
  }

  // Q: why not force login form on each app start?
  // A: because it would be too frequent for user.
  //
  // Q: why not check authorization on each app start, and force login form only
  //    when auth check fails?
  // A: because auth check requires request to db server. on slow network it
  //    will slowdown entire app start. since we are offline ready, we have
  //    everything we need to open mindset as fast as possible. right after
  //    mindset is opened we making that auth check.
  //
  // Q: why not force login form right after auth check fails?
  // A: because by the time server responds, user may already make some changes
  //    to mindset. if we force login form, we will distract user attention from
  //    mindset and possibly loose unsaved changes.
  //    instead we notifying user about auth issue unobtrusively (with db
  //    connection state icon), allowing to open login form manually. and if
  //    user not paying attention to that - forcing login on next app start.
  if (shouldLogin) {
    await mutate(view('update-main', openScreen(MainScreen.auth)));

    if (userName && userPassword) {
      await mutate(
        view('update-auth-screen', {
          mode: AuthScreenMode.login,
          signupForm: null,
          loginForm: new LoginForm({
            username: userName,
            password: userPassword
          })
        })
      );

      dispatch({type: 'on-auth-login-form-login'});
    }
  } else {
    await mutate(view('update-main', openScreen(MainScreen.mindset)));

    dispatch({
      type: 'load-mindset',
      data: {
        isInitialLoad: true,
        sessionDbServerUrl: lastDbServerUrl,
        sessionUserName: lastUserName
      }
    });
  }
}
