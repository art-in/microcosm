import EventedViewModel from '../shared/EventedViewModel';
import MenuVM from '../misc/Menu';
import MenuItemVM from '../misc/MenuItem';
import Point from '../misc/Point';
import Node from './Node';

const nodes_ = new WeakMap();
const links_ = new WeakMap();

export default class Graph extends EventedViewModel {

  static eventTypes() {
    return [
      'change',
      'nodeAdd',
      'nodeChange',
      'nodeDelete',
      'linkChange'
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

    this.contextMenu = {
      on: false,
      pos: null,
      node: null,
      def: new MenuVM([
        new MenuItemVM('add'),
        new MenuItemVM('delete')
      ])
    };

    addContextMenuHandlers.call(this);
  }

  toString() {
    return `[Graph (${this.nodes}) (${this.links})]`;
  }

  //region properties

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
    if (this.contextMenu.on) {
      this.contextMenu.on = false;
      this.emit('change');
    }
  }

  onNodeRightClick(node, pos) {
    this.contextMenu.on = true;
    this.contextMenu.pos = pos;
    this.contextMenu.node = node;
    this.emit('change');
  }

  onNodeContextMenuClick(menuItem) {
    let node = this.contextMenu.node;

    switch (menuItem.displayValue) {
      case 'add': this.emit('nodeAdd', node); break;
      case 'delete': this.emit('nodeDelete', node); break;
    }
  }

  onNodeTitleChange(node) {
    this.emit('nodeChange', node);
  }

  onLinkTitleChange(link) {
    this.emit('linkChange', link);
  }

  onNodeDoubleClick(parentNode) {
    this.emit('nodeAdd', parentNode);
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

  onDragRevert(e) {
    if (!this.drag.on) {
      return;
    }

    this.drag.on = false;

    this.onDragCanceled(
      this.drag.node,
      this.drag.startX,
      this.drag.startY);
  }

  onDragStop() {
    if (!this.drag.on) {
      return;
    }

    this.drag.on = false;
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

function addNodeHandlers(node) {
  node.on('titleChange', this.onNodeTitleChange.bind(this, node));
}

function addLinkHandlers(link) {
  link.on('titleChange', this.onLinkTitleChange.bind(this, link));
}

function addContextMenuHandlers() {
  this.contextMenu.def.on('itemSelected',
    this.onNodeContextMenuClick.bind(this));
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
