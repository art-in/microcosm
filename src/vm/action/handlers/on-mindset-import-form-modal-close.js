import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles close event from import form modal
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-mindset-vm', {
    importFormModal: {
      modal: {active: false}
    }
  });
}
