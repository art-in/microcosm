import PriorityQueue from 'utils/PriorityQueue';

/**
 * Calculates minimal root paths (MRP) for each node in the graph.
 * 
 * Uses Dijkstra algorithm (BFS + priority queue)
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
 * 
 * @param {object} rootNode
 * @return {array} MRP data for each node
 */
export default function calcRootPaths(rootNode) {

    // key - node,
    // value - node weight data
    const weightData = new Map();

    weightData.set(rootNode, {
        rootPathWeight: 0,
        linkFromParent: null,
        linksToChilds: []
    });

    const queue = new PriorityQueue();

    queue.addWithPriority(rootNode, 0);

    const visitedNodes = new Set();

    while (queue.length) {

        // get node with min root path weight
        const predecessor = queue.extractMin();

        const predecessorData = weightData.get(predecessor);

        predecessor.linksOut.forEach(link => {

            const successor = link.to;

            // ensure link weight is valid
            if (!Number.isFinite(link.weight) || link.weight < 0) {
                throw Error(
                    `Link '${link.id}' has invalid weight '${link.weight}'`);
            }

            // weight of proposed path (root->...->predecessor->successor)
            const pathWeight = predecessorData.rootPathWeight + link.weight;
            
            // get existing weight data of successor
            let successorData = weightData.get(successor);
            if (!successorData) {
                successorData = {
                    rootPathWeight: +Infinity,
                    linkFromParent: null,
                    linksToChilds: []
                };
                weightData.set(successor, successorData);
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
                    const prevParentData = weightData.get(prevParent);
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

    return [...weightData.entries()].map(entry => ({
        node: entry[0],
        rootPathWeight: entry[1].rootPathWeight,
        linkFromParent: entry[1].linkFromParent,
        linksToChilds: entry[1].linksToChilds
    }));
}