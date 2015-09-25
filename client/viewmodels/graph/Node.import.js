import EventedViewModel from '../shared/EventedViewModel';
import Point from 'client/viewmodels/misc/Point';

export default class Node extends EventedViewModel {

  static eventTypes() {
    return [
      'change',
      'titleChange'
    ];
  }

  constructor() {
    super();

    this.id = undefined;
    this.pos = new Point();
    this.radius = 10;
    this.title = '';
    this.titleEditable = false;
    this.isCentral = false;
    this.color = '';
    this.links = [];

    this.debug = false;
  }

  toString() {
    return `[Node` +
      (this.isCentral ? '* ' : ' ') +
      `(${this.id}) ` +
      `(${this.pos.x} x ${this.pos.y}) ` +
      `(links: ${this.links.length}}) ` +
      `(${this.title})]`;
  }

  //region handlers

  onTitleClick() {
    if (!this.titleEditable) {
      this.titleEditable = true;
      this.emit('change');
    }
  }

  onTitleBlur() {
    if (this.titleEditable) {
      this.titleEditable = false;
      this.emit('change');
    }
  }

  onTitleChange(title) {
    this.title = title;
    this.emit('titleChange');
    this.emit('change');
  }

  //endregion

}