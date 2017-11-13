import required from 'utils/required-params';
import PriorityQueue from 'utils/PriorityQueue';

/**
 * Calculates minimal root paths (MRP) for each node in the graph.
 * MRPs form minimal spanning tree (MST) upon the graph.
 * 
 * Uses Dijkstra algorithm (BFS + priority queue)
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
 * 
 * Q: why return MRP data for nodes and not mutate original nodes?
 * A: this would clear-out previous state of the graph and prevent diff`ing
 *    to later effectively mutate database.
 * 
 * Q: when we know that some parts of the graph should be changed we replacing
 *    that parts on-the-fly during paths calculations (through 'replace' opts).
 * Q  a) why not change original graph first and then make calculations?
 * A  a) we cannot mutate graph state inside action handler, but we can apply
 *       intermediate mutations in AC and then make calculations. this is
 *       possible, but it would mean we need to mutate same entities several
 *       times (eg. when creating cross link first we need to mutate 
 *       parent node to add new outgoing link, and after that possibly mutate
 *       same node again to add link to child).
 * Q  b) why not duplicate original graph or create graph in different
 *       representation (eg. adjacency matrix) with applied changes and then
 *       calculate paths on that duplicate?
 * A  b) duplicating original graph or creating it in different representations
 *       for purposes of on-graph calculations goin to be extremely inefficient,
 *       since it would need to dupl/create graphs with possibly thousands of
 *       nodes for each graph mutation. this would produce lots of objects which
 *       will hurt GC.
 * 
 * @param {object} opts
 * @param {object} opts.rootNode
 * @param {array} [opts.ignoreLinks]
 * @param {array} [opts.replaceLinksOut]
 * @param {array} [opts.replaceLinkWeights]
 * @return {array} MRP data for each node
 */
export default function calcRootPaths(opts) {

    const {root} = required(opts);
    const {
        ignoreLinks = [],
        replaceLinksOut = [],
        replaceLinkWeights = []
    } = opts;

    // key - node,
    // value - MRP data
    const rootPathData = new Map();

    rootPathData.set(root, {
        rootPathWeight: 0,
        linkFromParent: null,
        linksToChilds: []
    });

    const queue = new PriorityQueue();

    queue.addWithPriority(root, 0);

    const visitedNodes = new Set();

    while (queue.length) {

        // get node with min root path weight
        const predecessor = queue.extractMin();

        const predecessorData = rootPathData.get(predecessor);

        // get outgoing links
        const linksOut = getNodeLinksOut(
            predecessor,
            replaceLinksOut,
            ignoreLinks);

        linksOut.forEach(link => {

            const successor = link.to;

            // get link weight
            const linkWeight = getLinkWeight(link, replaceLinkWeights);

            // ensure link weight is valid
            if (!Number.isFinite(linkWeight) || linkWeight < 0) {
                throw Error(
                    `Link '${link.id}' has invalid weight '${linkWeight}'`);
            }

            // weight of proposed path (root->...->predecessor->successor)
            const pathWeight = predecessorData.rootPathWeight + linkWeight;
            
            // get existing weight data of successor
            let successorData = rootPathData.get(successor);
            if (!successorData) {
                successorData = {
                    rootPathWeight: +Infinity,
                    linkFromParent: null,
                    linksToChilds: []
                };
                rootPathData.set(successor, successorData);
            }

            // check if proposed path is better then current one
            if (successorData.rootPathWeight === undefined ||
                successorData.rootPathWeight > pathWeight) {

                // proposed path is better, use it as current best path

                // update minimal path weight
                successorData.rootPathWeight = pathWeight;

                // update parent-child references

                // remove child link from previous parent
                if (successorData.linkFromParent) {
                    const prevParent = successorData.linkFromParent.from;
                    const prevParentData = rootPathData.get(prevParent);
                    const links = prevParentData.linksToChilds;
                    const linkIdx = links.indexOf(successorData.linkFromParent);
                    links.splice(linkIdx, 1);
                }

                // add child link to new parent
                predecessorData.linksToChilds.push(link);

                // update link from parent
                successorData.linkFromParent = link;

                // update priority queue
                if (queue.has(successor)) {
                    queue.updatePriority(successor, pathWeight);
                }
            }

            if (!visitedNodes.has(successor)) {
                queue.addWithPriority(successor, successorData.rootPathWeight);
                visitedNodes.add(successor);
            }
        });
    }

    // return MRP data
    return [...rootPathData.entries()].map(e => ({
        node: e[0],
        rootPathWeight: e[1].rootPathWeight,
        linkFromParent: e[1].linkFromParent,
        linksToChilds: e[1].linksToChilds
    }));
}

/**
 * Gets link weight
 * @param {object} link 
 * @param {array} replaceLinkWeights
 * @return {number}
 */
function getLinkWeight(link, replaceLinkWeights) {
    const replace = replaceLinkWeights.find(r => r.link === link);
    if (replace) {
        return replace.weight;
    } else {
        return link.weight;
    }
}

/**
 * Gets outgoing links for node
 * @param {object} node 
 * @param {array} replaceLinksOut 
 * @param {array} ignoreLinks 
 * @return {array}
 */
function getNodeLinksOut(node, replaceLinksOut, ignoreLinks) {
    let linksOut;

    const replace = replaceLinksOut.find(r => r.node === node);
    if (replace) {
        linksOut = replace.linksOut;
    } else {
        linksOut = node.linksOut;
    }

    return linksOut.filter(l => !ignoreLinks.includes(l));
}