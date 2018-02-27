import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';
import openScreen from 'vm/main/Main/methods/open-screen';
import MainScreen from 'vm/main/MainScreen';

/**
 * Opens auth screen
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {dbHeartbeatToken} = state.data;

  // cancel db heartbeat, since after login we can aim another db
  dbHeartbeatToken.cancel();

  return view('update-main', openScreen(MainScreen.auth));
}
