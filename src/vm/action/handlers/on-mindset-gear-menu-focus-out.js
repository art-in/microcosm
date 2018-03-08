import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import viewPatch from 'vm/utils/view-patch';

/**
 * Handles focus out event from mindset gear menu
 *
 * @return {PatchType}
 */
export default function() {
  return viewPatch('update-mindset-vm', {
    gearMenu: {isActive: false}
  });
}
