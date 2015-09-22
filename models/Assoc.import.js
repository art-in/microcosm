import { newIdStr } from 'lib/helpers/mongoHelpers';

export default class Assoc {

  constructor() {
    this.id = newIdStr();
    this.from = undefined;
    this.to = undefined;
    this.value = 'new assoc';
  }

  toString() {
    return `[Assoc ` +
      `(${this.id}) ` +
      `(${this.from} - ${this.to}) ` +
      `(${this.value})]`;
  }

};