import assert from 'assert';

import GraphVM from 'ui/viewmodels/graph/Graph';
import Mindmap from 'domain/models/Mindmap';

import traverseGraph from 'lib/graph/traverse-nodes-graph';
import mapGraph from 'lib/graph/map-ideas-to-nodes-graph';

/**
 * Maps mindmap model to graph view model
 * @param {Mindmap} mindmap
 * @return {Graph}
 */
export default function mindmapToGraph(mindmap) {
    assert(mindmap instanceof Mindmap,
        `Object '${mindmap}' is not a Mindmap`);

    let rootNode;
    let nodes = [];
    let links = [];

    if (mindmap.root) {
        const map = mapGraph(mindmap.root);
        rootNode = map.rootNode;
        nodes = map.nodes;
        links = map.links;

        // travers graph
        // set color on main sub graph
        rootNode.linksOut.forEach(l => {
            const subNode = l.to;
            
            traverseGraph(subNode, n => {
                n.color = subNode.color;
            });
        });
    }
    
    const graph = new GraphVM();

    graph.id = mindmap.id;
    graph.nodes = nodes;
    graph.links = links;
    graph.viewbox.x = mindmap.x;
    graph.viewbox.y = mindmap.y;
    graph.viewbox.scale = mindmap.scale;

    graph.root = rootNode;

    return graph;
}