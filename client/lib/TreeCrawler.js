export default class TreeCrawler {

    traverseTree(node, cb) {
        node.links.forEach(l => {
            this.traverseTree(l.toNode, cb);
        });
        cb(node);
    }

}