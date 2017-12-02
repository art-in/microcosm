import update from 'utils/update-object';

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

    update(link, data);
}