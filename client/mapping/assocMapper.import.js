import { getIdStr } from 'client/lib/mongoHelpers';

export default {

  assocToLink(nodes, assoc) {
    let fromNode = nodes.find((node) => node.id === assoc.from);
    let toNode = nodes.find((node) => node.id === assoc.to);

    !fromNode && console.warn(`unable to find idea [${assoc.from}]`);
    !toNode && console.warn(`unable to find idea [${assoc.to}]`);

    return {
      id: getIdStr(assoc),
      fromNode,
      toNode
    };
  }

}