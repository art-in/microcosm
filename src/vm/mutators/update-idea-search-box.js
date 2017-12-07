import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import IdeaSearchBoxType from 'vm/shared/IdeaSearchBox';

/**
 * Updates idea search box
 * 
 * @param {StateType} state
 * @param {Partial<IdeaSearchBoxType>} data
 */
export default function(state, data) {
    const {ideaSearchBox} = state.vm.main.mindmap.graph;

    updateViewModel(ideaSearchBox, data);
}