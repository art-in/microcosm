import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import LinkType from 'vm/map/entities/Link';

/**
 * Updates link
 * 
 * @param {StateType} state
 * @param {Partial<LinkType>} data
 */
export default function updateLink(state, data) {
    const {mindmap} = state.vm.main.mindset;
    const link = mindmap.links.find(l => l.id === data.id);

    updateViewModel(link, data);
}