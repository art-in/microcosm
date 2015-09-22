import Menu from './Menu';

export default class ContextMenu extends Menu {

  constructor(menuItems) {
    super(menuItems);

    this.active = false;
    this.pos = null;
    this.target = null;
  }

  toString() {
    return `[ContextMenu (items: ${this.items.length})]`;
  }

  activate({pos, target}) {
    this.active = true;
    this.pos = pos;
    this.target = target;
    this.emit('change');
  }

  deactivate() {
    this.active = false;
    this.emit('change');
  }

}