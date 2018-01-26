import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles focus out event from idea search lookup
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-idea-search-box', {active: false});
}
