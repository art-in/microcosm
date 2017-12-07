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
    const {graph} = state.vm.main.mindmap;
    const link = graph.links.find(l => l.id === data.id);

    updateViewModel(link, data);
}