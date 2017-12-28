import toGraph from 'vm/map/mappers/mindset-to-graph';

import StateType from 'boot/client/State';
import updateGraphPersistentProps from 'vm/utils/update-graph-persistent-props';

/**
 * Applies all mutations that do not have correspoding mutators
 * @param {StateType} state
 */
export default function defaultMutator(state) {

    // by default, remap from model as simpliest coding approach
    // (not best performance though).
    // some model changes can radically change viewmodel (eg. moving viewbox can
    // remove bunch of nodes and add bunch of new nodes, or zooming-out can
    // completely change almost all nodes because of shading).
    // instead of doing clever patches on existing graph, it is simplier to
    // rebuild whole graph from stratch.
    const newGraph = toGraph(state.model.mindset);

    const graph = state.vm.main.mindset.graph;

    // instead of replacing graph with newly mapped one, only take necessary.
    // this keeps graph view model bound to view, and keeps view specific state.
    updateGraphPersistentProps(graph, newGraph);
}