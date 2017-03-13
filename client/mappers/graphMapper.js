import assert from 'assert';

import GraphVM from 'client/viewmodels/graph/Graph';
import {ideaToNode} from 'client/mappers/nodeMapper';
import {assocToLink} from 'client/mappers/linkMapper';
import Mindmap from 'models/Mindmap';
import TreeCrawler from 'client/lib/TreeCrawler';

/**
 * Maps mindmap model to graph view model
 * @param {Mindmap} mindmap
 * @return {Graph}
 */
export function mindmapToGraph(mindmap) {
    assert(mindmap instanceof Mindmap);

    const nodes = mindmap.ideas.map(ideaToNode);
    const links = mindmap.assocs.map(assocToLink.bind(null, nodes));

    // travers tree
    const centralNode = nodes.find(n => n.isCentral);
    if (!centralNode) {
        console.warn('There is no central node in the tree');
    } else {
        const crawler = new TreeCrawler();

        // set color on main sub trees
        centralNode.links.forEach(l => {
            const subNode = l.toNode;
            crawler.traverseTree(subNode, (n) => {
                n.color = subNode.color;
            });
        });
    }

    const graph = new GraphVM();

    graph.nodes = nodes;
    graph.links = links;
    graph.viewbox.x = mindmap.x;
    graph.viewbox.y = mindmap.y;
    graph.viewbox.scale = mindmap.scale;

    return graph;
}

/**
 * Maps graph view model to mindmap model
 * @param {Graph} graph
 * @param {Mindmap} mindmap
 * @return {Mindmap}
 */
export function graphToMindmap(graph, mindmap) {
    assert(graph instanceof GraphVM);
    assert(mindmap instanceof Mindmap);

    mindmap.x = graph.viewbox.x;
    mindmap.y = graph.viewbox.y;
    mindmap.scale = graph.viewbox.scale;

    return mindmap;
}