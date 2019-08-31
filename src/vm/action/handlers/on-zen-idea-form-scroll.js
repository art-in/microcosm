import PatchType from 'utils/state/Patch';
import view from 'vm/utils//view-patch';

/**
 * Handles scroll event from idea pane
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-zen-pane', {isScrolledTop: false});
}
