export default class Assoc {

  constructor() {
    this._id = undefined;
    this.from = undefined;
    this.to = undefined;
  }

  toString() {
    return `[Assoc (${this._id}) (${this.from} - ${this.to})]`;
  }

};