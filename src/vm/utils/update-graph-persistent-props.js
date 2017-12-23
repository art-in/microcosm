import GraphType from 'vm/map/entities/Graph';
import computeViewbox from 'vm/map/entities/Graph/methods/compute-viewbox-size';

/**
 * Updates graph view model by updating only persistent (saved to db) props of
 * graph state, and preserving view specific part of state (eg. opened popups,
 * tooltips, etc.)
 * 
 * Use case: when it is easier to not update graph directly, but recreate from
 * model. and not replace existing graph because that would clear out view
 * specifics, but update existing one.
 * 
 * Q: why not recreate only persistent part of graph from model and then update
 *    existing graph then (instead of recreating entire graph)?
 * A: yes, that would be another way to do it. not sure which one is better.
 * 
 * @param {GraphType} oldGraph 
 * @param {GraphType} newGraph 
 */
export default function updateGraphPersistentProps(oldGraph, newGraph) {

    if (oldGraph === newGraph) {
        return;
    }

    oldGraph.id = newGraph.id;

    oldGraph.debugInfo = newGraph.debugInfo;
    oldGraph.viewbox = newGraph.viewbox;
    oldGraph.nodes = newGraph.nodes;
    oldGraph.links = newGraph.links;
    oldGraph.root = newGraph.root;

    oldGraph.viewbox = computeViewbox({
        viewport: oldGraph.viewport,
        viewbox: oldGraph.viewbox
    });

    oldGraph.isDirty = true;
}