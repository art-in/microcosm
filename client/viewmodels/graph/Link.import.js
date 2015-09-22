import EventedViewModel from '../shared/EventedViewModel';

export default class Link extends EventedViewModel {

  static eventTypes() {
    return [
      'change',
      'titleChange'
    ];
  }

  constructor() {
    super();

    this.id = undefined;
    this.fromNode = undefined;
    this.toNode = undefined;
    this.title = '';
    this.titleEditable = false;
  }

  toString() {
    return `[Link` +
      (this.isBOI ? '* ' : ' ') +
      `(${this.id}) ` +
      `(${this.fromNode.pos.x} x ${this.fromNode.pos.y}) - ` +
      `(${this.toNode.pos.x} x ${this.toNode.pos.y}) ` +
      `(${this.color}) ` +
      `(${this.title})]`;
  }

  get isBOI() {
    return this.fromNode.isCentral;
  }

  get color() {
    return this.toNode.color;
  }

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

}