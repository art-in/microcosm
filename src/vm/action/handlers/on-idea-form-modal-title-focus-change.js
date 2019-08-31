import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

/**
 * Handles title focus change event from idea form modal
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-idea-form-modal', {form: {isTitleFocused: false}});
}
