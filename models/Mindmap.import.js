import { newIdStr } from 'lib/helpers/mongoHelpers';

export default class Mindmap {

  constructor() {

    this.id = undefined;
    this.mindmapId = undefined;
    this.viewbox = {
      x: 0,
      y: 0,
      scale: 1
    };
    this.ideas = [];
    this.assocs = [];
  }

  toString() {
    return `[Mindmap ` +
      `(${this.viewbox.x} - ${this.viewbox.y}) (${this.viewbox.scale})` +
      `]`;
  }

}
