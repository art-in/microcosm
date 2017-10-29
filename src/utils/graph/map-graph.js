/**
 * Generic function for mapping graph of one entities
 * to graph of another entities
 * 
 * @param {object} opts
 * @param {object} opts.originalNode
 * @param {function} opts.mapNode
 * @param {function} opts.mapLink
 * @param {number} [opts.depthMax=infinity] - max depth limit (inclusive)
 * @return {{rootNode, nodes, links}}
 */
export default function(opts) {

    const nodes = [];
    const links = [];
    const visitedOriginalNodes = new Map();

    const rootNode = mapGraph(
        opts,
        visitedOriginalNodes,
        nodes,
        links);

    return {
        rootNode,
        nodes,
        links
    };
}

/**
 * Private map
 * @param {object} opts
 * @param {object} opts.originalNode
 * @param {function} opts.mapNode
 * @param {function} opts.mapLink
 * @param {number} [opts.depthMax=infinity]
 * 
 * @param {Map} visitedOriginalNodes 
 * @param {array} allNodes 
 * @param {array} allLinks 
 * @return {{rootNode, nodes, links}}
 */
function mapGraph({
    node: originalNode,
    mapNode,
    mapLink,
    depthMax = Infinity
},
visitedOriginalNodes = new Map(),
allNodes,
allLinks) {
    
    // check if node was already visited
    // to not fail into infinite loop in graph cycles
    let node = visitedOriginalNodes.get(originalNode);
    if (node) {
        return node;
    }

    // map node
    node = mapNode(originalNode);
    visitedOriginalNodes.set(originalNode, node);

    const linksOut = [];

    // map links and target nodes (recursively)
    originalNode.linksOut.forEach(originalLink => {
        if (originalLink.to.depth > depthMax) {
            // do not map deeper
            return;
        }

        const link = mapLink(originalLink);
        link.from = node;
        link.to = mapGraph({
            node: originalLink.to,
            mapNode,
            mapLink,
            depthMax
        },
        visitedOriginalNodes,
        allNodes,
        allLinks);

        // add link to tail node as incoming link
        link.to.linksIn = link.to.linksIn || [];
        link.to.linksIn.push(link);
        
        // add link to head node as outgoing link
        linksOut.push(link);
        allLinks.push(link);
    });

    node.linksOut = linksOut;

    allNodes.push(node);

    return node;
}