import Point from 'client/viewmodels/misc/Point';

export default class Node {

  constructor() {
    this.id = undefined;
    this.pos = new Point();
  }

  toString() {
    return `[Node (${this.id}) (${this.pos.x} x ${this.pos.y})]`;
  }

}