import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles invite code change event from signup form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.invite
 * @return {PatchType}
 */
export default function(state, data) {
  const {invite} = required(data);

  return view('update-auth-screen', {
    signupForm: {
      invite,
      isInviteValid: true,
      isUsernameValid: true,
      isPasswordValid: true,
      errorNotification: {visible: false}
    }
  });
}
