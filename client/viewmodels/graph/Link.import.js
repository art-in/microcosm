import EventedViewModel from '../shared/EventedViewModel';

export default class Link extends EventedViewModel {

  static eventTypes() {
    return [
      'change',
      'titleChange'
    ];
  }

  constructor(fromNode, toNode) {
    super();

    this.id = undefined;
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.title = {
      value: '',
      editing: false,
      editable: true,
      visible: true
    };

    this.debug = false;
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

  //region publics

  get isBOI() {
    return this.fromNode.isCentral;
  }

  get color() {
    return this.toNode.color;
  }

  //endregion

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