import { newIdStr } from 'lib/helpers/mongoHelpers';

export default class Idea {

  constructor() {
    this.id = newIdStr();
    this.x = undefined;
    this.y = undefined;
  }

  toString() {
    return `[Idea (${this.id}) (${this.x} x ${this.y})]`;
  }

};