import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

/**
 * Handles scroll event from idea form modal
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-idea-form-modal', {modal: {isScrolledTop: false}});
}
