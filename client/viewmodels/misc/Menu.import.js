export default class Menu extends EventEmitter {

  constructor(items) {
    super();

    this.items = items;
  }

  onItemSelected(item) {
    this.emit('itemSelected', item);
  }

}