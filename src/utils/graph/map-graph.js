import required from 'utils/required-params';

import WeightZone from 'utils/graph/WeightZone';

/**
 * Generic function for mapping graph of entities of one type
 * to graph of entities of another type
 * 
 * While mapping it is possible to slice particular portion of graph,
 * basing on how far target node is from root (root path weight).
 * 
 * From perspective of root path weight, all nodes fall into 3 groups
 * or weight zones:
 * 
 *     focus zone          (A)--->(B)<
 *                        / |      ^  \
 *   --------------------/--|------|---\--------
 *                      /   v      |    \ 
 *     shade zone      |   (C)--->(D)    \
 *                     |    #      ^      |
 *   ------------------|----#------#------|-----
 *                     v    v      #      |
 *     hide zone      (E)<#(#)###>(#)####>(F)
 * 
 * 
 *  # - nodes and links that were ignored while mapping
 * 
 * Slicing uses following rules:
 * 
 * Nodes in focus zone can target nodes in focus, shade or hide zones.
 * Nodes in shade zone can target nodes in shade, focus, but not in hide zone.
 * Nodes in hide zone can target nodes in focus, but not in hide or shade zones.
 * 
 * Main purposes of slicing are
 * - reduce amount of nodes by hiding too distant ones, while preserving all
 *   incoming and outgoing links for nodes in focus zone.
 * - not slice rougly, but introduce intermediate 'shade' zone with 'relaxed'
 *   slicing rules
 * 
 * Note: mapping can produce graph with nodes unreachable from root.
 * it can happen for nodes located in hide zone, that target nodes
 * in focus zone (F to B link on the scheme)
 * 
 * @param {object}   opts
 * @param {object}   opts.originalNode
 * @param {function} opts.mapNode
 * @param {function} opts.mapLink
 * @param {number}   [opts.focusZoneMax=infinity] - focus weight zone max
 * @param {number}   [opts.shadeZoneAmount=0]     - shade weight zone amount
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

    if (opts.focusZoneMax === undefined) {
        opts.focusZoneMax = Infinity;
    }
    
    if (opts.shadeZoneAmount === undefined) {
        opts.shadeZoneAmount = 0;
    }

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
 * @param {number}   opts.focusZoneMax
 * @param {number}   opts.shadeZoneAmount
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
        mapLink,
        focusZoneMax,
        shadeZoneAmount
    } = required(opts);

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

    const nodeZone = getWeightZoneForNode(
        originalNode,
        focusZoneMax,
        shadeZoneAmount);

    // map node
    node = mapNode(originalNode, nodeZone);
    visitedOriginalNodes.set(originalNode, node);

    allNodes.push(node);

    node.linksIn = [];
    node.linksOut = [];

    node.linkFromParent = null;
    node.linksToChilds = [];

    // map predecessor nodes.
    originalNode.linksIn.forEach(originalLink => {

        const predecessorZone = getWeightZoneForNode(
            originalLink.from,
            focusZoneMax,
            shadeZoneAmount);

        if (!shouldFollowLink(predecessorZone, nodeZone)) {
            return;
        }

        const link = mapLink(originalLink, predecessorZone, nodeZone);

        link.to = node;
        link.from = mapGraphInternal({
            node: originalLink.from,
            mapNode,
            mapLink,
            focusZoneMax,
            shadeZoneAmount
        }, {
            visitedOriginalNodes,
            allNodes,
            allLinks
        });

        // bind link to head/tail nodes
        link.from.linksOut.push(link);
        link.to.linksIn.push(link);

        // bind link to parent/child nodes
        if (originalLink.to.linkFromParent === originalLink) {
            link.to.linkFromParent = link;
            link.from.linksToChilds.push(link);
        }

        allLinks.push(link);
    });

    // map successor nodes.
    originalNode.linksOut.forEach(originalLink => {
        const successorZone = getWeightZoneForNode(
            originalLink.to,
            focusZoneMax,
            shadeZoneAmount);

        if (!shouldFollowLink(nodeZone, successorZone)) {
            return;
        }

        mapGraphInternal({
            node: originalLink.to,
            mapNode,
            mapLink,
            focusZoneMax,
            shadeZoneAmount
        }, {
            visitedOriginalNodes,
            allNodes,
            allLinks
        });
    });

    return node;
}

/**
 * Gets weight zone for node
 * @param {Node}   node
 * @param {number} focusZoneMax
 * @param {number} shadeZoneAmount
 * @return {number} weight zone
 */
function getWeightZoneForNode(node, focusZoneMax, shadeZoneAmount) {

    const {rootPathWeight} = node;

    // ensure root path weight set
    if (!Number.isFinite(rootPathWeight) || rootPathWeight < 0) {
        throw Error(`Invalid root path weight '${rootPathWeight}'`);
    }

    if (rootPathWeight <= focusZoneMax) {
        return WeightZone.focus;
    } else
    if (rootPathWeight <= focusZoneMax + shadeZoneAmount) {
        return WeightZone.shade;
    } else {
        return WeightZone.hide;
    }
}

/**
 * Decides whether mapper should follow link while traversing original graph,
 * or ignore going farther and skip mapping that branch
 * @param {number} predecessorZone
 * @param {number} successorZone
 * @return {boolean}
*/
function shouldFollowLink(predecessorZone, successorZone) {
    const {focus, shade, hide} = WeightZone;

    const from = predecessorZone;
    const to = successorZone;

    if (from === focus &&
       (to === focus || to === shade || to === hide)) {
        return true;
    }

    if (from === shade &&
       (to === shade || to === focus)) {
        return true;
    }

    if (from === hide && to === focus) {
        return true;
    }

    return false;
}