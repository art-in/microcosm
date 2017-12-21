import required from 'utils/required-params';

import StateType from 'boot/client/State';
import MainVmType from 'vm/main/Main';
import updateGraphPersistentProps from 'vm/utils/update-graph-persistent-props';

/**
 * Inits mindmap
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function initMindmap(state, data) {
    const {vm} = state;
    const {isLoaded, graph} = required(data.vm.mindmap);

    const {mindmap} = vm.main;

    mindmap.isLoaded = isLoaded;

    if (mindmap.graph) {
        // mindmap can be re-initialized several times (eg. on mindmap reloads
        // per server sync changes), we do not want to clear out view specific
        // state in that case (eg. opened idea form)
        updateGraphPersistentProps(mindmap.graph, graph);
    } else {
        mindmap.graph = graph;
    }

    mindmap.graph.isDirty = true;
}