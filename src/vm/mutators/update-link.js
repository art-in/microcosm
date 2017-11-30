import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates link
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function updateLink(state, data) {
    const {graph} = state.vm.main.mindmap;
    const link = graph.links.find(l => l.id === data.id);

    update(link, data);
}