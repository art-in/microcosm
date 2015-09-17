import { idToStr, strToId } from 'lib/helpers/mongoHelpers';
import Link from 'client/viewmodels/graph/Link';
import Assoc from 'models/Assoc';

export function assocToLink(nodes, assoc) {
  if (!(assoc instanceof Assoc)) { throw Error('invalid assoc type'); }

  let fromNode = nodes.find((node) => node.id === assoc.from);
  let toNode = nodes.find((node) => node.id === assoc.to);

  !fromNode && console.warn(
    `unable to find idea while mapping association [${assoc.from}]`);
  !toNode && console.warn(
    `unable to find idea while mapping association [${assoc.to}]`);

  let link = new Link();
  link.id = assoc.id;
  link.fromNode = fromNode;
  link.toNode = toNode;

  return link;
}

export default {
  assocToLink
}