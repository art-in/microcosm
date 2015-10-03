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
    this.pos = new Point(0, 0);
    this.radius = 0;
    this.title = {
      value: '',
      editing: false,
      editable: true,
      visible: true
    };
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
    if (this.title.editable && !this.title.editing) {
      this.title.editing = true;
      this.emit('change');
    }
  }

  onTitleBlur() {
    if (this.title.editable && this.title.editing) {
      this.title.editing = false;
      this.emit('change');
    }
  }

  onTitleChange(title) {
    this.title.value = title;
    this.emit('titleChange');
    this.emit('change');
  }

  //endregion

}