import assert from 'utils/assert';

import GraphVM from 'vm/map/entities/Graph';
import Mindmap from 'model/entities/Mindmap';

import traverseGraph from 'utils/graph/traverse-graph';
import mapGraph from 'utils/graph/map-graph';

import getFocusDepth from '../utils/get-graph-focus-depth';

import ideaToNode from './idea-to-node';
import assocToLink from './association-to-link';

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
    let maxDepth = 0;
    let focusDepth = 0;

    if (mindmap.root) {

        // calc depth shading limits
        // nodes below focused depth should be shaded
        // nodes below max depth should be hidden
        focusDepth = getFocusDepth(mindmap.scale);
        const shadeDepth = focusDepth;
        maxDepth = focusDepth + 3;

        // map mindmap to graph
        const res = mapGraph({
            node: mindmap.root,
            depthMax: maxDepth,
            mapLink: assoc => {
                const link = assocToLink(assoc);

                // depth shading
                link.shaded = assoc.to.depth > shadeDepth;

                return link;
            },
            mapNode: idea => {
                const node = ideaToNode(idea);

                // depth shading
                node.shaded = idea.depth > shadeDepth;
                node.title.visible = idea.depth - shadeDepth < 2;

                return node;
            }
        });
        
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
    graph.height = maxDepth;
    graph.focusDepth = focusDepth;

    return graph;
}