import assert from 'assert';

import Link from 'ui/viewmodels/graph/Link';
import Association from 'domain/models/Association';

/**
 * Maps association model to link view model
 * @param {array.<Node>} nodes
 * @param {Association} assoc
 * @return {Link}
 */
export function assocToLink(nodes, assoc) {
    assert(assoc instanceof Association);

    const fromNode = nodes.find(node => node.id === assoc.from);
    const toNode = nodes.find(node => node.id === assoc.to);

    !fromNode && console.warn(
        `unable to find 'from' idea while mapping association [${assoc.from}]`);
    !toNode && console.warn(
        `unable to find 'to' idea while mapping association [${assoc.to}]`);

    const link = new Link();

    link.id = assoc.id;
    link.fromNode = fromNode;
    link.toNode = toNode;
    link.title.value = assoc.value;

    fromNode.links.push(link);

    return link;
}

/**
 * Maps link view model to association model
 * @param {Link} link
 * @param {Association} assoc
 * @return {Association}
 */
export function linkToAssoc(link, assoc) {
    assert(link instanceof Link);
    assert(assoc instanceof Association);

    assoc.id = link.id;
    assoc.from = link.fromNode.id;
    assoc.to = link.toNode.id;
    assoc.value = link.title.value;

    return assoc;
}