/**
 * Calculates and sets depths of all nodes in the graph.
 * 
 * Depth = distance from root
 * Distance = minimal lenght of path between nodes
 * 
 * Uses Dijkstra algorithm
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
 * Dijkstra algorithm: BFS + priority queue.
 * 
 * @param {object} rootNode 
 * @return {object} root node
 */
export default function calcDepths(rootNode) {

    rootNode.depth = 0;

    const queue = [];
    queue.unshift(rootNode);

    const visitedNodes = new Set();

    while (queue.length) {

        // if links would have weights (ie. in weighted graph),
        // we would need to use priority queue
        // and get node with minimum depth first here.
        // but since graph is not weighted, we can use simple FIFO.
        const currentNode = queue.pop();

        const successors = currentNode.linksOut.map(l => l.to);
        successors.forEach(successor => {

            const depth = currentNode.depth + 1;
            
            if (successor.depth === undefined ||
                successor.depth > depth) {
                successor.depth = depth;
            }

            if (!visitedNodes.has(successor)) {
                queue.unshift(successor);
                visitedNodes.add(successor);
            }
        });
    }

    return rootNode;
}