import updateViewModel from "vm/utils/update-view-model";

import StateType from "boot/client/State";
import SearchBoxType from "vm/shared/SearchBox";

/**
 * Updates idea search box
 *
 * @param {StateType} state
 * @param {Partial<SearchBoxType>} data
 */
export default function(state, data) {
  const { ideaSearchBox } = state.vm.main.mindset;

  updateViewModel(ideaSearchBox, data);
}
