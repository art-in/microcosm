export default class EventedViewModel extends EventEmitter {

  static eventTypes() {
    console.warn(
      `Add eventTypes() static method to view model ` +
      `and return array of event types`);
    return [];
  }

  constructor() {
    super();
  }

  get displayName() {
    return this.constructor.name;
  }

  emit(eventType, ...args) {
    if (!this.hasListeners(eventType)) {
      console.warn(
        `No one listens to "${eventType}" event ` +
        `of ${this.displayName} view model`);
      return;
    }

    super.emit(eventType, ...args);
  }

  on(...args) {
    this.addListener(...args);
  }

  addListener(eventType, ...args) {
    if (!this.hasEventType(eventType)) {
      console.warn(
        `No "${eventType}" event to listen ` +
        `on ${this.displayName} view model`);

      return;
    }

    super.on(eventType, ...args);
  }

  hasListeners(eventType) {
    return super.listeners(eventType).length !== 0;
  }

  hasEventType(eventType) {
    let eventTypes = this.constructor.eventTypes();

    if (!Array.isArray(eventTypes)) {
      console.warn(
        `eventTypes() of ${this.displayName} view model should return array`);
      return false;
    }

    return eventTypes.some((e) => e === eventType);
  }

}