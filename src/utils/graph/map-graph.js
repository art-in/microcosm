import required from 'utils/required-params';

/**
 * Generic function for mapping graph of entities of one type
 * to graph of entities of another type
 * 
 * @param {object}   opts
 * @param {object}   opts.originalNode
 * @param {function} opts.mapNode
 * @param {function} opts.mapLink
 * @param {number}   [opts.depthMax=infinity] - max depth limit (inclusive)
 * @return {{rootNode, nodes, links}}
 */
export default function mapGraph(opts) {

    const nodes = [];
    const links = [];

    const internalOpts = {
        visitedOriginalNodes: new Map(),
        allNodes: nodes,
        allLinks: links
    };

    const rootNode = mapGraphInternal(opts, internalOpts);

    return {
        rootNode,
        nodes,
        links
    };
}

/**
 * Internal map
 * @param {object}   opts
 * @param {object}   opts.originalNode
 * @param {function} opts.mapNode
 * @param {function} opts.mapLink
 * @param {number}   [opts.depthMax=infinity]
 * 
 * @param {object} internalOpts
 * @param {Map}    internalOpts.visitedOriginalNodes 
 * @param {array}  internalOpts.allNodes 
 * @param {array}  internalOpts.allLinks 
 * @return {{rootNode, nodes, links}}
 */
function mapGraphInternal(opts, internalOpts) {
    
    const {
        node: originalNode,
        mapNode,
        mapLink
    } = required(opts);

    const depthMax = opts.depthMax || Infinity;

    const {
        visitedOriginalNodes,
        allNodes,
        allLinks
    } = required(internalOpts);

    // check if node was already visited
    // to not fall into infinite loop in graph cycles
    let node = visitedOriginalNodes.get(originalNode);
    if (node) {
        return node;
    }

    // map node
    node = mapNode(originalNode);
    visitedOriginalNodes.set(originalNode, node);

    allNodes.push(node);

    if (originalNode.depth > depthMax) {
        // do not map links of predecessor nodes below depth limit
        return node;
    }

    // map predecessor nodes.
    // always map all incoming links and predecessor nodes
    // even if they are below depth limit
    originalNode.linksIn.forEach(originalLink => {
        const link = mapLink(originalLink);
        
        link.to = node;
        link.from = mapGraphInternal({
            node: originalLink.from,
            mapNode,
            mapLink,
            depthMax
        }, {
            visitedOriginalNodes,
            allNodes,
            allLinks
        });

        // bind link to head/tail nodes
        link.from.linksOut.push(link);
        link.to.linksIn.push(link);

        allLinks.push(link);
    });

    // map successor nodes.
    originalNode.linksOut.forEach(originalLink => {
        if (originalLink.to.depth > depthMax) {
            // do not map successor node below depth limit
            return;
        }

        mapGraphInternal({
            node: originalLink.to,
            mapNode,
            mapLink,
            depthMax
        }, {
            visitedOriginalNodes,
            allNodes,
            allLinks
        });
    });

    return node;
}