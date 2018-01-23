import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles focusout event from idea form successor lookup
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-idea-form-successor-search-box', {
    active: false
  });
}
