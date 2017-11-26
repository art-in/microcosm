import update from 'utils/update-object';

/**
 * Updates link
 * 
 * @param {object} state
 * @param {object} data
 */
export default function updateLink(state, data) {
    const {graph} = state.vm.main.mindmap;
    const link = graph.links.find(l => l.id === data.id);

    update(link, data);
}