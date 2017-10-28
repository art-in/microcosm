/**
 * Calculates and sets depths of all nodes in the graph (or sub-graph).
 * 
 * Depth = distance from root
 * Distance = minimal length of path between nodes
 * 
 * Uses Dijkstra algorithm
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
 * Dijkstra algorithm: BFS + priority queue.
 * 
 * @param {object} startNode - can be graph root node to calc entire graph
 *                             or any graph node to calc particular sub-graph
 * @param {number} startDepth - depth of start node
 * @return {object} start node
 */
export default function calcDepths(startNode, startDepth) {

    // ensure start depth is passed and it is valid number
    if (!Number.isInteger(startDepth)) {
        throw Error(`Invalid start depth '${startNode.depth}'`);
    }

    // depths calculated for nodes.
    // map(key - node, value - calculated depth)
    // separate depths storage is needed to make sure
    // previous node depths do not interfere with this pass.
    const depths = new Map();

    startNode.depth = startDepth;
    depths.set(startNode, startDepth);

    const queue = [];
    queue.unshift(startNode);

    const visitedNodes = new Set();

    while (queue.length) {

        // if links would have weights (ie. in weighted graph),
        // we would need to use priority queue
        // and get node with minimum depth first here.
        // but since graph is not weighted, we can use simple FIFO.
        const currentNode = queue.pop();

        const successors = currentNode.linksOut.map(l => l.to);
        successors.forEach(successor => {

            const depth = depths.get(currentNode) + 1;
            
            const successorDepth = depths.get(successor);

            if (successorDepth === undefined ||
                successorDepth > depth) {
                successor.depth = depth;
                depths.set(successor, depth);
            }

            if (!visitedNodes.has(successor)) {
                queue.unshift(successor);
                visitedNodes.add(successor);
            }
        });
    }

    return startNode;
}