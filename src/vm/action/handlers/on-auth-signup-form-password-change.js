import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles password change event from signup form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.password
 * @return {PatchType}
 */
export default function(state, data) {
  const {password} = required(data);

  return view('update-auth-screen', {
    signupForm: {
      password,
      isInviteValid: true,
      isUsernameValid: true,
      isPasswordValid: true,
      errorNotification: {visible: false}
    }
  });
}
