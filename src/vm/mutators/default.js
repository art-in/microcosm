import toGraph from 'vm/map/mappers/mindmap-to-graph';

import StateType from 'boot/client/State';

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
    const newGraph = toGraph(state.model.mindmap);

    const graph = state.vm.main.mindmap.graph;

    // instead of replacing graph with newly mapped one, only take necessary.
    // this keeps graph view model bound to view, and keeps view specific state.
    graph.debugInfo = newGraph.debugInfo;
    graph.viewbox = {
        ...newGraph.viewbox,
        width: graph.viewbox.width,
        height: graph.viewbox.height
    };
    graph.nodes = newGraph.nodes;
    graph.links = newGraph.links;
    graph.root = newGraph.root;

    graph.isDirty = true;
}