/**
 * Generic function for mapping graph of one entities
 * to graph of another entities
 * 
 * @param {object} opts
 * @param {object} opts.originalNode
 * @param {function} opts.mapNode
 * @param {function} opts.mapLink
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
 * @param {Map} visitedOriginalNodes 
 * @param {array} allNewNodes 
 * @param {array} allNewLinks 
 * @return {{rootNode, nodes, links}}
 */
function mapGraph({
    node: originalNode,
    mapNode,
    mapLink
},
visitedOriginalNodes = new Map(),
allNewNodes,
allNewLinks) {
    
    // check if node was already visited
    // to not fail into infinite loop in graph cycles
    let newNode = visitedOriginalNodes.get(originalNode);
    if (newNode) {
        return newNode;
    }

    // map node
    newNode = mapNode(originalNode);
    visitedOriginalNodes.set(originalNode, newNode);

    const newLinks = [];

    // map links and target nodes (recursively)
    originalNode.links.forEach(originalLink => {
        const newLink = mapLink(originalLink);
        newLink.from = newNode;
        newLink.to = mapGraph({
            node: originalLink.to,
            mapNode,
            mapLink
        },
        visitedOriginalNodes,
        allNewNodes,
        allNewLinks);
        
        newLinks.push(newLink);
        allNewLinks.push(newLink);
    });

    newNode.links = newLinks;

    allNewNodes.push(newNode);

    return newNode;
}