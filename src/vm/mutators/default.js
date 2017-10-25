import toGraph from 'vm/map/mappers/mindmap-to-graph';

/**
 * Applies all mutations that do not have correspoding mutators
 * @param {object} state
 */
export default function defaultMutator(state) {

    // save vm specific part of state
    const {
        zoomInProgress,
        viewbox: {width: vbWidth, height: vbHeight},
        viewport
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
    // so vm stays bound to view.
    const graph = state.vm.main.mindmap.graph;
    for (const prop in newGraph) {
        if (!newGraph.hasOwnProperty(prop) || prop.startsWith('_')) {
            // ignore props from prototype and private props
            // (ie. state of event emitter)
            continue;
        }

        graph[prop] = newGraph[prop];
    }

    // since remapping from model clears vm specific part of state
    // (like state of dropdowns, lookups, etc), we need to restore them
    graph.zoomInProgress = zoomInProgress;
    graph.viewbox.width = vbWidth;
    graph.viewbox.height = vbHeight;
    graph.viewport = viewport;
}