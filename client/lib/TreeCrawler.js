/**
 * Tree crawler
 */
export default class TreeCrawler {

    /**
     * Calls callback function on each node in the tree
     * @param {Node} node
     * @param {function} cb
     */
    traverseTree(node, cb) {
        node.links.forEach(l => {
            this.traverseTree(l.toNode, cb);
        });
        cb(node);
    }

}