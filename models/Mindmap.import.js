import { newIdStr } from 'lib/helpers/mongoHelpers';

export default class Mindmap {

  constructor() {
    this.id = newIdStr();
    this.mindmapId = undefined;
    this.x = 0;
    this.y = 0;
    this.scale = 0;

    this.ideas = [];
    this.assocs = [];
  }

  toString() {
    return `[Mindmap ` +
      `(${this.x} - ${this.y}) (${this.scale})` +
      `]`;
  }

}
