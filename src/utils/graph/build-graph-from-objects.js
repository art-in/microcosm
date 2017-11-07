import required from 'utils/required-params';
import traverseGraph from 'utils/graph/traverse-graph';

/**
 * Generic function for building object graph
 * from arrays of node and link objects
 * 
 * @param {object}         opts
 * @param {array.<object>} opts.nodes - generic nodes
 * @param {array.<object>} opts.links - generic links
 * @param {function}       opts.isRootNode - checks if passed node is graph root
 * @return {object} root node
 */
export default function buildGraph(opts) {
    const {nodes, links, isRootNode} = required(opts);

    let rootNode = null;

    const visitedNodes = new Set();

    if (links.length === 0 && nodes.length === 1 &&
        isRootNode(nodes[0])) {
        
        // graph of single root node
        rootNode = nodes[0];
        rootNode.linksIn = [];
        rootNode.linksOut = [];

        return rootNode;
    }

    links.forEach(link => {

        // set head/tail node to link
        const nodeHead = nodes.find(i => i.id === link.fromId);
        if (!nodeHead) {
            throw Error(
                `Head node '${link.fromId}' ` +
                `of link '${link.id}' was not found`);
        }

        const nodeTail = nodes.find(i => i.id === link.toId);
        if (!nodeTail) {
            throw Error(
                `Tail node '${link.toId}' ` +
                `of link '${link.id}' was not found`);
        }

        link.from = nodeHead;
        link.to = nodeTail;
        
        // mark visited nodes
        visitedNodes.add(nodeHead);
        visitedNodes.add(nodeTail);

        // init links
        nodeHead.linksIn = nodeHead.linksIn || [];
        nodeTail.linksIn = nodeTail.linksIn || [];
        nodeHead.linksOut = nodeHead.linksOut || [];
        nodeTail.linksOut = nodeTail.linksOut || [];

        // add link to head node as outgoing link
        nodeHead.linksOut.push(link);

        // add link to tail node as incoming link
        nodeTail.linksIn.push(link);

        // mark root node
        if (isRootNode(nodeHead)) {
            rootNode = nodeHead;
        }
    });

    // check root exists
    if (!rootNode) {
        throw Error(`No root node was found`);
    }

    // check all nodes can be reached from the root
    visitedNodes.clear();
    traverseGraph({
        node: rootNode,
        visit: node => {
            visitedNodes.add(node);
        }
    });

    const notVisitedNodes = nodes
        .filter(n => !visitedNodes.has(n))
        .map(n => n.id);

    if (notVisitedNodes.length) {
        throw Error(
            `Some nodes cannot be reached from root: '` +
            `${notVisitedNodes.join('\', \'')}'`);
    }

    return rootNode;
}