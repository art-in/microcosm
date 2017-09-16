import assert from 'assert';

import GraphVM from 'vm/map/entities/Graph';
import Mindmap from 'model/entities/Mindmap';

/**
 * Maps graph view model to mindmap model
 * @param {Graph} graph
 * @param {Mindmap} mindmap
 * @return {Mindmap}
 */
export default function graphToMindmap(graph, mindmap) {
    assert(graph instanceof GraphVM,
        `Object '${graph}' is not a Graph`);
    assert(mindmap instanceof Mindmap,
        `Object '${mindmap}' is not a Mindmap`);

    mindmap.x = graph.viewbox.x;
    mindmap.y = graph.viewbox.y;
    mindmap.scale = graph.viewbox.scale;

    return mindmap;
}