import toGraph from 'vm/map/mappers/mindmap-to-graph';
import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Applies all mutations that do not have correspoding mutators
 * @param {StateType} state
 */
export default function defaultMutator(state) {

    // save vm specific part of state
    const {
        zoomInProgress,
        viewbox: {width: vbWidth, height: vbHeight},
        viewport: {width: vpWidth, height: vpHeight},
        ideaSearchBox: {active: ideaSearchBoxActive}
    } = state.vm.main.mindmap.graph;

    // by default, remap from model as simpliest coding
    // approach (not best performance though).
    // some model changes can radically change viewmodel
    // (eg. moving viewbox can remove bunch of nodes and add
    // bunch of new nodes, or zooming-out can completely change
    // almost all nodes because of shading)
    // instead of doing clever patches on existing graph,
    // it is simplier to rebuild whole graph from stratch.
    const newGraph = toGraph(state.model.mindmap);

    // update existing graph vm instead of replacing it,
    // so vm stays bound to view (child object arrays still replaced).
    const graph = state.vm.main.mindmap.graph;
    update(graph, newGraph, (prop, targetValue, sourceValue) =>
        // do not copy internal state of event emitter
        prop !== '_events' &&
        prop !== '_maxListeners' &&
        // do not copy uninitialized props
        sourceValue !== undefined
    );

    // since remapping from model clears vm specific part of state
    // (like state of dropdowns, lookups, etc), we need to restore them
    graph.zoomInProgress = zoomInProgress;
    
    graph.viewbox.width = vbWidth;
    graph.viewbox.height = vbHeight;

    graph.viewport.width = vpWidth;
    graph.viewport.height = vpHeight;

    graph.ideaSearchBox.active = ideaSearchBoxActive;
}