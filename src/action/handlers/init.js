import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';
import ClientConfigType from 'boot/client/config/ClientConfig';

import view from 'vm/utils/view-patch';
import ConnectionState from 'action/utils/ConnectionState';
import getDbConnectionState from 'action/utils/get-db-connection-state';
import MainVM from 'vm/main/Main';
import VersionVM from 'vm/main/Version';
import MainScreen from 'vm/main/MainScreen';
import openScreen from 'vm/main/Main/methods/open-screen';

/**
 * Inits state on app start
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} data.fetch
 * @param {function} data.setTimeout
 * @param {function} data.storeDispatch
 * @param {ClientConfigType} data.clientConfig
 * @param {string} data.sessionDbServerUrl
 * @param {string} data.apiServerUrl
 * @param {Element} data.viewRoot
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function init(state, data, dispatch, mutate) {
  const {
    fetch,
    setTimeout,
    storeDispatch,
    clientConfig,
    apiServerUrl,
    viewRoot
  } = required(data);

  // init view model
  const main = new MainVM({
    screen: MainScreen.loading,
    version: new VersionVM({
      name: clientConfig.app.name,
      homepage: clientConfig.app.homepage,
      version: clientConfig.app.version
    })
  });

  const {protocol, host, port} = clientConfig.dbServer;
  const sessionDbServerUrl = `${protocol}://${host}:${port}`;

  await mutate(
    new Patch({
      type: 'init',
      data: {
        sideEffects: {fetch, setTimeout},
        params: {clientConfig, sessionDbServerUrl, apiServerUrl},
        vm: {main},
        view: {root: viewRoot, storeDispatch}
      }
    })
  );

  const {userName, isDbAuthorized, dbServerUrl} = state.data;

  let shouldLogin;

  if (!dbServerUrl) {
    // force login form on first visit
    shouldLogin = true;
  } else if (!isDbAuthorized) {
    // force login form if last connection was not authorized.
    // ensure db server is reachable, otherwise we will not be able to
    // authenticate user without db server
    const connectionState = await getDbConnectionState(
      dbServerUrl,
      userName,
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
  } else {
    await mutate(view('update-main', openScreen(MainScreen.mindset)));

    dispatch({
      type: 'load-mindset',
      data: {
        isInitialLoad: true,
        sessionDbServerUrl: dbServerUrl,
        sessionUserName: userName
      }
    });
  }
}
