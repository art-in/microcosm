import {toGraph} from 'mappers/graphMapper';

import MainVM from 'ui/viewmodels/Main';
import MindmapVM from 'ui/viewmodels/Mindmap';

/**
 * Applies patch to viewmodel state
 * @param {object} state
 * @param {Patch} patch
 * @return {object} new view-model state
 */
export default async function mutate(state, patch) {
    
    await Promise.all(patch.map(async function(mutation) {
        state.vm = await apply(state, mutation);
    }));

    return state.vm;
}

/**
 * Applies single mutation to state
 * @param {object} state
 * @param {{type, data}} mutation
 * @return {object} new view-model state
 */
async function apply(state, mutation) {

    switch (mutation.type) {
    case 'init':
        state.vm.main = new MainVM();
        state.vm.main.mindmap = new MindmapVM();
        state.vm.main.mindmap.graph = toGraph(state.model.mindmap);
        state.vm.main.emit('change');
        break;
    default:
        // always re-map from model as simpliest coding
        // approach (not best performance though).
        // some model changes can radically change viewmodel
        // (eg. moving viewbox can remove bunch of nodes and add
        // bunch of new nodes, or zooming-out can completely change
        // almost all nodes because of shading)
        // instead of doing clever patches on existing graph 
        // it is simplier just to rebuild whole graph from stratch
        state.vm.main.mindmap.graph = toGraph(state.model.mindmap);
        state.vm.main.emit('change');
    }

    return state.vm;
}