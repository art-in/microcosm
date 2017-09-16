import traverseGraph from './traverse-graph';

/**
 * Generic function for building object graph
 * from nodes/links object arrays
 * 
 * @param {array.<object>} nodes - generic nodes
 * @param {array.<object>} links - generic links
 * @param {string} nodeName - name of nodes (for error messages)
 * @param {string} linkName - name of link (for error messages)
 * @param {function} isRootNode - checks if passed node is graph root
 * @return {object} root node
 */
export default function buildGraph(
    nodes,
    links,
    nodeName,
    linkName,
    isRootNode) {

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
                `Head ${nodeName} '${link.fromId}' ` +
                `of ${linkName} '${link.id}' was not found`);
        }

        const nodeTail = nodes.find(i => i.id === link.toId);
        if (!nodeTail) {
            throw Error(
                `Tail ${nodeName} '${link.toId}' ` +
                `of ${linkName} '${link.id}' was not found`);
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
        throw Error(`No root ${nodeName} was found`);
    }

    // check all nodes can be reached from the root
    visitedNodes.clear();
    traverseGraph(
        rootNode,
        node => {
            visitedNodes.add(node);
        });

    const notVisitedNodes = nodes
        .filter(n => !visitedNodes.has(n))
        .map(n => n.id);

    if (notVisitedNodes.length) {
        throw Error(
            `Some ${nodeName}s cannot be reached from root: '` +
            `${notVisitedNodes.join('\', \'')}'`);
    }

    return rootNode;
}