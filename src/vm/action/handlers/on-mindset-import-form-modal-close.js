import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';
import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/ImportForm';

/**
 * Handles close event from import form modal
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {sideEffects: {confirm}, vm: {main: {mindset}}} = state;

  const {form} = mindset.importFormModal;

  // TODO: confirm on window close too
  if (form.inProgress && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  const token = form.inProgress ? {isCanceled: true} : null;

  return view('update-mindset-vm', {
    importFormModal: {
      form: {token},
      modal: {active: false}
    }
  });
}
