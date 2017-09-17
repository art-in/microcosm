import assert from 'assert';

import GraphVM from 'vm/map/entities/Graph';
import Mindmap from 'model/entities/Mindmap';

import traverseGraph from 'utils/graph/traverse-graph';
import mapGraph from './ideas-to-nodes-graph';

import getFocusDepth from '../utils/get-graph-focus-depth';

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
    let height = 0;
    let focusDepth = 0;

    if (mindmap.root) {

        // calc depth shadowing limits
        // show nodes on close depths below focus depth,
        // more deeper nodes should be hidden
        focusDepth = getFocusDepth(mindmap.scale);
        height = focusDepth + 2;
        
        // map mindmap to graph
        const res = mapGraph(mindmap.root, height);
        rootNode = res.rootNode;
        nodes = res.nodes;
        links = res.links;

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
    graph.height = height;
    graph.focusDepth = focusDepth;

    return graph;
}