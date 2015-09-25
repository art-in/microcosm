import EventedViewModel from '../shared/EventedViewModel';

export default class Menu extends EventedViewModel {

  static eventTypes() {
    return [
      'change',
      'itemSelected'];
  }

  constructor(items) {
    super();

    this.items = items;
  }

  //region handlers

  onItemSelected(item) {
    this.emit('itemSelected', item);
  }

  //endregion

}