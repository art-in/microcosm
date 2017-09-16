import mapGraph from 'utils/graph/map-graph';

import ideaToNode from './idea-to-node';
import assocToLink from './association-to-link';

/**
 * Maps graph of idea models to graph of node viewmodels
 * @param {Idea} rootIdea - root idea
 * @return {{node, nodes, links}} root node, lists of new nodes and links
 */
export default function(rootIdea) {
    return mapGraph({
        node: rootIdea,
        mapNode: ideaToNode,
        mapLink: assocToLink
    });
}