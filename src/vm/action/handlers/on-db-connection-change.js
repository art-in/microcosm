import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';
import Icon from 'vm/shared/Icon';
import ConnectionState from 'action/utils/ConnectionState';

/**
 * Handles change of server database connection state
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.dbServerUrl
 * @param {ConnectionState} data.connectionState
 * @return {Patch}
 */
export default function(state, data) {
  const {dbServerUrl, connectionState} = required(data);

  let tooltipLines;
  let icon;
  let isClickable;
  let isDbAuthorized;

  switch (connectionState) {
    case ConnectionState.connected:
      icon = Icon.server;
      tooltipLines = [
        `Mindset is connected to server database (${dbServerUrl})`,
        `All changes are saved locally and on server.`
      ];
      isClickable = false;
      isDbAuthorized = true;
      break;

    case ConnectionState.disconnected:
      icon = Icon.plug;
      tooltipLines = [
        `Mindset is disconnected from server database (${dbServerUrl})`,
        `All changes are saved locally and will be sent to server when ` +
          `connection is restored.`
      ];
      isClickable = false;
      isDbAuthorized = state.data.local.isDbAuthorized;
      break;

    case ConnectionState.unauthorized:
      icon = Icon.exclamationTriangle;
      tooltipLines = [
        `Mindset is not authorized to access server database ` +
          `(${dbServerUrl})`,
        `All changes are saved locally, but not sent to server.`,
        '',
        `Click to open login form.`
      ];
      isClickable = true;
      isDbAuthorized = false;
      break;

    default:
      throw Error(
        `Unknown server DB connection state ` + `'${connectionState}'`
      );
  }

  return new Patch({
    type: 'update-db-connection',
    data: {
      icon,
      tooltip: tooltipLines.join('\n'),
      isClickable,
      isDbAuthorized
    }
  });
}
