import update from "utils/update-object";

import ViewModel from "vm/utils/ViewModel";

/**
 * Mutates view model
 * Makes sure dirty flag is raised (including child view models)
 *
 * @param {ViewModel} vm
 * @param {object} data
 */
export default function updateViewModel(vm, data) {
  update(vm, data, (prop, targetValue) => {
    if (typeof targetValue === "object" && targetValue instanceof ViewModel) {
      // raise dirty flag on affected child view models too.
      targetValue.isDirty = true;
    }
  });

  vm.isDirty = true;
}
