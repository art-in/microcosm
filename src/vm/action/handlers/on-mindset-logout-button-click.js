import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import closeSession from 'vm/action/utils/auth/close-session';
import viewPatch from 'vm/utils/view-patch';
import MainScreen from 'vm/main/MainScreen';
import openScreen from 'vm/main/Main/methods/open-screen';

/**
 * Handles click event from logout button
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
  const {fetch, reload} = state.sideEffects;
  const {dbServerUrl} = state.data;

  await mutate(viewPatch('update-main', openScreen(MainScreen.loading)));

  await mutate(new Patch({type: 'cleanup', targets: ['data']}));

  // await session closing, so browser have time to apply cookie before reload
  const response = await closeSession(dbServerUrl, fetch);
  if (response.isConnected && !response.ok) {
    // server was reached but session closing failed, which is weird.
    // ignore errors in case server is not reachable, since we cannot cleanup
    // session token without server.
    throw Error('Failed to close session.');
  }

  // reload the page to re-init the app. we could dispatch 'init' action here,
  // but reloading seems cleaner and easier solution
  reload();
}
