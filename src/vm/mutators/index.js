import MainVM from 'vm/main/Main';
import MindmapVM from 'vm/main/Mindmap';

import toGraph from 'vm/map/mappers/mindmap-to-graph';

/**
 * Applies patch to viewmodel state
 * @param {object} state
 * @param {Patch} patch
 * @return {object} new view-model state
 */
export default async function mutate(state, patch) {
    
    if (patch['init']) {
        state.vm.main = new MainVM();
        state.vm.main.mindmap = new MindmapVM();
    }

    // always re-map from model as simpliest coding
    // approach (not best performance though).
    // some model changes can radically change viewmodel
    // (eg. moving viewbox can remove bunch of nodes and add
    // bunch of new nodes, or zooming-out can completely change
    // almost all nodes because of shading)
    // instead of doing clever patches on existing graph,
    // it is simplier to rebuild whole graph from stratch
    state.vm.main.mindmap.graph = toGraph(state.model.mindmap);

    return state;
}