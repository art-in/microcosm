import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import GraphVmType from 'vm/map/entities/Graph';

/**
 * Updates graph
 * 
 * @param {StateType} state
 * @param {Partial<GraphVmType>} data
 */
export default function updateGraph(state, data) {
    const {graph} = state.vm.main.mindmap;

    updateViewModel(graph, data);
}