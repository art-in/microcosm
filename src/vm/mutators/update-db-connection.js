import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import MindsetType from 'vm/main/Mindset';
import requiredParams from 'utils/required-params';

/**
 * Updates database connection icon
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function updateDbConnection(state, data) {
  const {dbConnectionIcon} = state.vm.main.mindset;
  const {icon, tooltip, isClickable} = requiredParams(data);

  updateViewModel(dbConnectionIcon, {icon, tooltip, isClickable});
}
