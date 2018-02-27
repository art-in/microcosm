import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles toggle collapse event from zen sidebar
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {zen: {sidebar}}}}} = state;

  return view('update-zen-sidebar', {
    isCollapsed: !sidebar.isCollapsed
  });
}
