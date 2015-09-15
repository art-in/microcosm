export default class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x} x ${this.y})`;
  }

}