import { idToStr, strToId } from 'lib/helpers/mongoHelpers';
import Link from 'client/viewmodels/graph/Link';
import Assoc from 'models/Assoc';

export function assocToLink(nodes, assoc) {
  if (!(assoc instanceof Assoc)) { throw Error('invalid assoc type'); }

  let fromNode = nodes.find((node) => node.id === assoc.from);
  let toNode = nodes.find((node) => node.id === assoc.to);

  !fromNode && console.warn(
    `unable to find 'from' idea while mapping association [${assoc.from}]`);
  !toNode && console.warn(
    `unable to find 'to' idea while mapping association [${assoc.to}]`);

  let link = new Link();

  link.id = assoc.id;
  link.fromNode = fromNode;
  link.toNode = toNode;
  link.title.value = assoc.value;

  fromNode.links.push(link);

  return link;
}

export function linkToAssoc(link, assoc) {
  if (!(link instanceof Link)) { throw Error('invalid link type'); }
  if (!(assoc instanceof Assoc)) { throw Error('invalid assoc type'); }

  assoc.id = link.id;
  assoc.from = link.fromNode.id;
  assoc.to = link.toNode.id;
  assoc.value = link.title.value;

  return assoc;
}

export default {
  assocToLink,
  linkToAssoc
}