import updateViewModel from "vm/utils/update-view-model";

import StateType from "boot/client/State";
import LookupPopupType from "vm/shared/LookupPopup";

/**
 * Updates association tails lookup
 *
 * @param {StateType} state
 * @param {Partial<LookupPopupType>} data
 */
export default function updateAssociationTailsLookup(state, data) {
  const { associationTailsLookup } = state.vm.main.mindset.mindmap;

  updateViewModel(associationTailsLookup, data);
}
