import EventedViewModel from '../shared/EventedViewModel';
import Node from './Node';
import Point from 'client/viewmodels/misc/Point';

export default class Graph extends EventedViewModel {

  static eventTypes() {
    return [
      'change',
      'nodeChange',
      'nodeAdd',
      'nodeContextMenu'
    ];
  }

  constructor() {
    super();

    this.nodes = [];
    this.links = [];

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

  moveNode({nodeId, pos, shift}) {
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

  onDragStart(item, startX, startY, e) {
    this.drag = {
      on: true,
      item: item,
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
      this.drag.item,
      this.drag.startX,
      this.drag.startY);
  }

  onDragStop() {
    if (!this.drag.on) {
      return;
    }

    this.drag.on = false;
    this.emit('nodeChange', this.drag.item);
  }

  onDrag(e) {
    if (!this.drag.on) {
      return;
    }

    let shiftX = e.clientX - this.drag.x;
    let shiftY = e.clientY - this.drag.y;

    this.drag.x = e.clientX;
    this.drag.y = e.clientY;

    this.onDragStep(this.drag.item, shiftX, shiftY);
  }

  onDragStep(node, shiftX, shiftY) {
    this.moveNode({nodeId: node.id, shift: {x: shiftX, y: shiftY}});
  }

  onDragCanceled(node, x, y) {
    this.moveNode({nodeId: node.id, pos: {x, y}});
  }

  onNodeDoubleClick(parentNode) {
    this.emit('nodeAdd', parentNode);
  }

  onNodeContextMenu(node, e) {
    this.emit('nodeContextMenu', node, new Point(e.clientX, e.clientY));
    e.preventDefault();
  }

}

function getNode(nodeId) {
  let node = this.nodes.find((n) => n.id === nodeId);
  if (!node) { throw Error(`No node with such id found: ${nodeId}`); }
  return node;
}