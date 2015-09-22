import Link from './Link';
import EventedViewModel from '../shared/EventedViewModel';
import ContextMenu from '../misc/ContextMenu';
import MenuItem from '../misc/MenuItem';
import Point from '../misc/Point';
import ColorPicker from '../misc/ColorPicker';
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

    this.nodeContextMenu = new ContextMenu([
      new MenuItem('add'),
      new MenuItem('delete')
    ]);

    this.linkContextMenu = new ContextMenu([
      new MenuItem('set color')
    ]);

    this.colorPicker = new ColorPicker();

    addNodeContextMenuHandlers.call(this);
    addLinkContextMenuHandlers.call(this);
    addColorPickerHandlers.call(this);
  }

  toString() {
    return `[Graph (${this.nodes}) (${this.links})]`;
  }

  //region getters/setters

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
    this.nodeContextMenu.active && this.nodeContextMenu.deactivate();
    this.linkContextMenu.active && this.linkContextMenu.deactivate();
    this.colorPicker.active && this.colorPicker.deactivate();
  }

  onNodeRightClick(node, pos) {
    this.nodeContextMenu.activate({pos, target: node});
  }

  onLinkRightClick(link, pos) {
    if (!link.isBOI) {
      // color can be set on BOI links only
      return;
    }
    this.linkContextMenu.activate({pos, target: link});
  }

  onNodeContextMenuItemSelected(menuItem) {
    let node = this.nodeContextMenu.target;

    switch (menuItem.displayValue) {
      case 'add': this.emit('nodeAdd', node); break;
      case 'delete': this.emit('nodeDelete', node); break;
      default: throw Error('unknown menu item');
    }

    this.nodeContextMenu.deactivate();
  }

  onLinkContextMenuItemSelected(menuItem) {
    let link = this.linkContextMenu.target;

    switch (menuItem.displayValue) {
      case 'set color': this.colorPicker.activate(link); break;
      default: throw Error('unknown menu item');
    }

    this.linkContextMenu.deactivate();
  }

  onColorPickerColorSelected(color) {
    let target = this.colorPicker.target;

    if (target.constructor === Link) {
      let node = target.toNode;
      node.color = color;
      this.emit('nodeChange', node);
    }

    this.colorPicker.deactivate();
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

function addNodeHandlers(node) {
  node.on('titleChange', this.onNodeTitleChange.bind(this, node));
}

function addLinkHandlers(link) {
  link.on('titleChange', this.onLinkTitleChange.bind(this, link));
}

function addNodeContextMenuHandlers() {
  this.nodeContextMenu.on('itemSelected',
    this.onNodeContextMenuItemSelected.bind(this));
}

function addLinkContextMenuHandlers() {
  this.linkContextMenu.on('itemSelected',
    this.onLinkContextMenuItemSelected.bind(this));
}

function addColorPickerHandlers() {
  this.colorPicker.on('colorSelected',
    this.onColorPickerColorSelected.bind(this));
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
