import toGraph from 'vm/map/mappers/mindmap-to-graph';

/**
 * Applies all mutations that do not have correspoding mutators
 * @param {object} state
 */
export default function defaultMutator(state) {

    // by default, re-map from model as simpliest coding
    // approach (not best performance though).
    // some model changes can radically change viewmodel
    // (eg. moving viewbox can remove bunch of nodes and add
    // bunch of new nodes, or zooming-out can completely change
    // almost all nodes because of shading)
    // instead of doing clever patches on existing graph,
    // it is simplier to rebuild whole graph from stratch.
    // this will clear all vm state specifics, which is not
    // part of model state (like state of dropdowns, lookups, etc.)
    state.vm.main.mindmap.graph = toGraph(state.model.mindmap);
}