import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import SearchBoxType from 'vm/shared/SearchBox';

/**
 * Updates successor search box in idea form
 * 
 * @param {StateType} state
 * @param {Partial<SearchBoxType>} data
 */
export default function(state, data) {
    const {mindmap} = state.vm.main.mindset;
    const {successorSearchBox} = mindmap.ideaFormModal.form;

    updateViewModel(successorSearchBox, data);
}