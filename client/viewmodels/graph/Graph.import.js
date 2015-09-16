export default class Graph extends EventEmitter {

  constructor() {
    super();

    this.nodes = [];
    this.links = [];
  }

  moveNode({nodeId, pos, shift}) {
    let node = this.nodes.find((n) => n.id === nodeId);

    if (!node) { throw Error(`No node with such id found: ${nodeId}`); }

    if (shift) {
      node.pos.x += shift.x;
      node.pos.y += shift.y;
    } else {
      node.pos.x = pos.x;
      node.pos.y = pos.y;
    }

    this.emit('change');
  }

}