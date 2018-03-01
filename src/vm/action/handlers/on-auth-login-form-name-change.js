import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles name change event from login form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.name
 * @return {PatchType}
 */
export default function(state, data) {
  const {name} = required(data);

  return view('update-auth-login-form', {
    name: {value: name, isInvalid: false},
    password: {isInvalid: false},
    errorNotification: {visible: false}
  });
}
