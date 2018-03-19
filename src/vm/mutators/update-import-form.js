import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import ImportFormType from 'vm/shared/ImportForm';

/**
 * Updates import form
 *
 * @param {StateType} state
 * @param {Partial<ImportFormType>} data
 */
export default function(state, data) {
  const {form} = state.vm.main.mindset.importFormModal;

  updateViewModel(form, data);
}
