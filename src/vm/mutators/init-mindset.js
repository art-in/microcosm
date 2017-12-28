import required from 'utils/required-params';

import StateType from 'boot/client/State';
import MainVmType from 'vm/main/Main';
import updateGraphPersistentProps from 'vm/utils/update-graph-persistent-props';

/**
 * Inits mindset
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function initMindset(state, data) {
    const {vm} = state;
    const {isLoaded, graph} = required(data.vm.mindset);

    const {mindset} = vm.main;

    mindset.isLoaded = isLoaded;

    if (mindset.graph) {
        // mindset can be re-initialized several times (eg. on mindset reloads
        // per server sync changes), we do not want to clear out view specific
        // state in that case (eg. opened idea form)
        updateGraphPersistentProps(mindset.graph, graph);
    } else {
        mindset.graph = graph;
    }

    mindset.graph.isDirty = true;
}