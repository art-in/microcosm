import { newIdStr } from 'lib/helpers/mongoHelpers';

export default class Idea {

  constructor() {
    this.id = newIdStr();
    this.mindmapId = undefined;
    this.x = undefined;
    this.y = undefined;
    this.value = '';
    this.isCentral = false;
    this.color = '';
  }

  toString() {
    return `[Idea` +
      (this.isCentral ? `* ` : ` `) +
      `(mm: ${this.mindmapId}) ` +
      `(${this.id}) ` +
      `(${this.x} x ${this.y}) ` +
      `(${this.value})]`;
  }

};