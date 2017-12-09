import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import IdeaFormModalType from 'vm/shared/IdeaFormModal';

/**
 * Updates idea form modal
 * 
 * @param {StateType} state
 * @param {Partial<IdeaFormModalType>} data
 */
export default function(state, data) {
    const {ideaFormModal} = state.vm.main.mindmap.graph;

    updateViewModel(ideaFormModal, data);
}