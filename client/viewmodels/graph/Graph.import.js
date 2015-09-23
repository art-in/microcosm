import EventedViewModel from '../shared/EventedViewModel';

const nodes_ = new WeakMap();
const links_ = new WeakMap();

export default class Graph extends EventedViewModel {

  static eventTypes() {
    return [
      'change',
      'click',
      'nodeChange',
      'linkChange',
      'nodeRightClick',
      'linkRightClick'
    ];
  }

  constructor() {
    super();

    nodes_.set(this, []);
    links_.set(this, []);

    this.drag = {
      on: false,
      item: null,
      startX: null,
      startY: null,
      x: null,
      y: null
    };
  }

  toString() {
    return `[Graph (${this.nodes}) (${this.links})]`;
  }

  //region get / set

  get nodes() {
    return nodes_.get(this);
  }

  set nodes(nodes) {
    nodes.forEach(addNodeHandlers.bind(this));
    nodes_.set(this, nodes);
  }

  get links() {
    return links_.get(this);
  }

  set links(links) {
    links.forEach(addLinkHandlers.bind(this));
    links_.set(this, links);
  }

  //endregion

  //region handlers

  onClick() {
    this.emit('click');
  }

  onNodeRightClick(node, pos) {
    this.emit('nodeRightClick', node, pos);
  }

  onLinkRightClick(link, pos) {
    this.emit('linkRightClick', link, pos);
  }

  //region dragging

  onDragStart(node, startX, startY, e) {
    if (e.nativeEvent.which !== 1) {
      // left button only
      return;
    }

    this.drag = {
      on: true,
      node: node,
      startX: startX,
      startY: startY,
      x: e.clientX,
      y: e.clientY
    };
  }

  onDragRevert() {
    if (!this.drag.on) {
      return;
    }

    this.drag.active = false;

    this.onDragCanceled(
      this.drag.node,
      this.drag.startX,
      this.drag.startY);
  }

  onDragStop() {
    if (!this.drag.on) {
      return;
    }

    this.drag.active = false;
    this.emit('nodeChange', this.drag.node);
  }

  onDrag(e) {
    if (!this.drag.on) {
      return;
    }

    let shiftX = e.clientX - this.drag.x;
    let shiftY = e.clientY - this.drag.y;

    this.drag.x = e.clientX;
    this.drag.y = e.clientY;

    this.onDragStep(this.drag.node, shiftX, shiftY);
  }

  onDragStep(node, shiftX, shiftY) {
    moveNode.call(this, {nodeId: node.id, shift: {x: shiftX, y: shiftY}});
  }

  onDragCanceled(node, x, y) {
    moveNode.call(this, {nodeId: node.id, pos: {x, y}});
  }

  //endregion

  //endregion

}

//region privates

function addNodeHandlers(node) {
  node.on('titleChange', this.emit.bind(this, 'nodeChange', node));
}

function addLinkHandlers(link) {
  link.on('titleChange', this.emit.bind(this, 'linkChange', link));
}

function getNode(nodeId) {
  let node = this.nodes.find((n) => n.id === nodeId);
  if (!node) {
    throw Error(`No node with such id found: ${nodeId}`);
  }
  return node;
}

function moveNode({nodeId, pos, shift}) {
  let node = getNode.call(this, nodeId);

  if (shift) {
    node.pos.x += shift.x;
    node.pos.y += shift.y;
  } else {
    node.pos.x = pos.x;
    node.pos.y = pos.y;
  }

  this.emit('change');
}

//endregion