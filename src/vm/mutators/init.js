import MainVM from 'vm/main/Main';
import MindmapVM from 'vm/main/Mindmap';

import toGraph from 'vm/map/mappers/mindmap-to-graph';

/**
 * Applies 'init' mutation
 * @param {object} state
 */
export default function init(state) {

    state.vm.main = new MainVM();
    state.vm.main.mindmap = new MindmapVM();
    state.vm.main.mindmap.graph = toGraph(state.model.mindmap);
}