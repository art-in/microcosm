import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import Icon from 'vm/shared/Icon';
import ConnectionState from 'action/utils/ConnectionState';

/**
 * Handles change of database server connection state
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.dbServerUrl
 * @param {ConnectionState} data.connectionState
 * @return {PatchType}
 */
export default function(state, data) {
  const {dbServerUrl, connectionState} = required(data);

  let tooltip;
  let icon;

  switch (connectionState) {
    case ConnectionState.connected:
      icon = Icon.server;
      tooltip =
        `Mindset is connected to database server ` +
        `(${dbServerUrl})\n` +
        `All changes are saved locally and on server.`;
      break;

    case ConnectionState.disconnected:
      icon = Icon.plug;
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
      icon,
      tooltip
    }
  });
}
