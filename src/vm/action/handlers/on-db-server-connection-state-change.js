import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import ConnectionState from 'action/utils/ConnectionState';
import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles change of database server connection state
 *
 * @param {StateType} state
 * @param {object} data
 * @param {ConnectionState} data.connectionState
 * @return {PatchType}
 */
export default function(state, data) {
  const {data: {dbServerUrl}} = state;
  const {connectionState} = required(data);

  let tooltip;

  switch (connectionState) {
    case ConnectionState.connected:
      tooltip =
        `Mindset is connected to database server ` +
        `(${dbServerUrl})\n` +
        `All changes are saved locally and on server.`;
      break;

    case ConnectionState.disconnected:
      tooltip =
        `Mindset is disconnected from database server ` +
        `(${dbServerUrl})\n` +
        `All changes are saved locally and will be sent to ` +
        `server when connection is restored.`;
      break;

    default:
      throw Error(
        `Unknown DB server connection state ` + `'${connectionState}'`
      );
  }

  return view('update-mindset-vm', {
    dbServerConnectionIcon: {
      state: connectionState,
      tooltip
    }
  });
}
