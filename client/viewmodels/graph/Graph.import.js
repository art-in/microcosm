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
      'viewportChange',
      'nodeRightClick',
      'linkRightClick'
    ];
  }

  constructor() {
    super();

    this.id = undefined;
    nodes_.set(this, []);
    links_.set(this, []);

    // drawing area
    this.viewport = {
      width: 0,
      height: 0
    };

    // fragment of canvas mapped to viewport
    this.viewbox = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      scale: 1,
      scaleMin: 0.2,
      scaleMax: 2
    };

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

  //region publics

  setViewportSize({width, height}) {
    this.viewport.width = width;
    this.viewport.height = height;

    recomputeViewbox.call(this);
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

  onViewportResize(size) {
    this.setViewportSize(size);
    this.emit('change');
  }

  onWheel(up) {
    zoom.call(this, up);
    this.emit('viewportChange');
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

function zoom(_in) {
  let viewbox = this.viewbox;
  viewbox.scale += (_in ? 1 : -1) * 0.2 * viewbox.scale;

  recomputeViewbox.call(this);
}

function recomputeViewbox() {
  let viewbox = this.viewbox;

  let {min, max, round} = Math;

  viewbox.scale = max(viewbox.scaleMin, viewbox.scale);
  viewbox.scale = min(viewbox.scaleMax, viewbox.scale);
  viewbox.scale = round(viewbox.scale * 100) / 100;

  viewbox.width = round(this.viewport.width / viewbox.scale);
  viewbox.height = round(this.viewport.height / viewbox.scale);
}

//endregion