import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles username change event from signup form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.username
 * @return {PatchType}
 */
export default function(state, data) {
  const {username} = required(data);

  return view('update-auth-screen', {
    signupForm: {
      username,
      isInviteValid: true,
      isUsernameValid: true,
      isPasswordValid: true,
      errorNotification: {visible: false}
    }
  });
}
