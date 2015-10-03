import { newIdStr } from 'lib/helpers/mongoHelpers';

export default class Assoc {

  constructor(from, to) {
    this.id = newIdStr();
    this.from = from;
    this.to = to;
    this.value = '';
  }

  toString() {
    return `[Assoc ` +
      `(${this.id}) ` +
      `(${this.from} - ${this.to}) ` +
      `(${this.value})]`;
  }

};