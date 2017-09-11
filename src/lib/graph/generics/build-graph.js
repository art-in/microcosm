import assert from 'assert';

import traverseGraph from './traverse-graph';

/**
 * Generic function for building graph structure 
 * from nodes and links
 * 
 * @param {array.<object>} nodes - generic nodes
 * @param {array.<object>} links - generic links
 * @param {string} nodeName - name of nodes (for error messages)
 * @param {string} linkName - name of link (for error messages)
 * @param {function} isRootNode - checks if passed node is graph root
 * @return {object} root node
 */
export default function(
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
        rootNode.links = [];

        return rootNode;
    }

    links.forEach(link => {

        // set starting/ending node to link
        const fromNode = nodes.find(i => i.id === link.fromId);
        assert(fromNode,
            `Starting ${nodeName} '${link.fromId}' was not found ` +
            `for ${linkName} '${link.id}'`);

        const toNode = nodes.find(i => i.id === link.toId);
        assert(toNode,
            `Ending ${nodeName} '${link.toId}' was not found ` +
            `for ${linkName} '${link.id}'`);

        link.from = fromNode;
        link.to = toNode;
        
        // mark visited nodes
        visitedNodes.add(fromNode);
        visitedNodes.add(toNode);

        // set outgoing links to node
        fromNode.links = fromNode.links || [];
        fromNode.links.push(link);

        toNode.links = toNode.links || [];

        // mark root node
        if (isRootNode(fromNode)) {
            rootNode = fromNode;
        }
    });

    // check root exists
    if (!rootNode) {
        throw Error(`No root ${nodeName} was found`);
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
            `Some ${nodeName}s cannot be reached from root: '` +
            `${notVisitedNodes.join('\', \'')}'`);
    }

    return rootNode;
}