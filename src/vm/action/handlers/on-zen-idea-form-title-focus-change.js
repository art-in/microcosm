import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

/**
 * Handles title focus change event from zen idea form
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-zen-pane', {form: {isTitleFocused: false}});
}
