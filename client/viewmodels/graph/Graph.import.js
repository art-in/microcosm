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

    this.pan = {
      active: false
    };

    this.drag = {
      active: false,
      item: null,
      startX: null,
      startY: null
    };

    this.debug = true;
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
    nodes.forEach(n => n.debug = this.debug);
    nodes_.set(this, nodes);
  }

  get links() {
    return links_.get(this);
  }

  set links(links) {
    links.forEach(addLinkHandlers.bind(this));
    links.forEach(l => l.debug = this.debug);
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

  //region pan

  onPanStart() {
    this.pan.active = true;
  }

  onPan({shiftX, shiftY}) {
    if (!this.pan.active) {
      return;
    }

    this.viewbox.x -= shiftX;
    this.viewbox.y -= shiftY;
    
    this.emit('change');
  }

  onPanStop() {
    if (!this.pan.active) {
      return;
    }

    this.pan.active = false;
    this.emit('viewportChange');
  }

  //endregion

  //region drag

  onDragStart(node) {
    this.drag = {
      active: true,
      node: node,
      startX: node.pos.x,
      startY: node.pos.y
    };
  }

  onDrag({shiftX, shiftY}) {
    if (!this.drag.active) {
      return;
    }

    moveNode.call(this, {
      nodeId: this.drag.node.id,
      shift: {x: shiftX, y: shiftY}
    });
  }

  onDragStop() {
    if (!this.drag.active) {
      return;
    }

    this.drag.active = false;
    this.emit('nodeChange', this.drag.node);
  }

  onDragRevert() {
    if (!this.drag.active) {
      return;
    }

    this.drag.active = false;

    moveNode.call(this, {
      nodeId: this.drag.node.id,
      pos: {x: this.drag.startX, y: this.drag.startY}
    });
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

  // zoom by 20%
  viewbox.scale += (_in ? 1 : -1) * 0.2 * viewbox.scale;

  let {width:prevWidth, height:prevHeight} = viewbox;
  recomputeViewbox.call(this);

  // zoom to/from the center of viewbox
  viewbox.x += (prevWidth - viewbox.width) / 2;
  viewbox.y += (prevHeight - viewbox.height) / 2;
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