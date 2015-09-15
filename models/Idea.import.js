export default class Idea {

  constructor() {
    this._id = undefined;
    this.x = undefined;
    this.y = undefined;
  }

  toString() {
    return `[Idea (${this._id}) (${this.x} x ${this.y})]`;
  }
}