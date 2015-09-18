/**
 * Binds 'change'-event of EventEmitter view model to component`s forceUpdate()
 * There's no need to mixin this if your view model does not emit 'change' events.
 *
 * @param {function} getViewModel - should return definition of view model like object:
 *          1. {['prop_name_with_vm']: EventEmitter} to rebind on props update
 *          2. or EventEmitter otherwise
 */
export default {

  //region component lifecycle

  componentWillReceiveProps(nextProps) {
    let vmPropName = this._getViewModelPropName();

    if (vmPropName) {
      let vmCur = this.props[vmPropName];
      if (vmCur) {
        this.removeVMListeners(vmCur);
      }

      let vmNext = nextProps[vmPropName];
      if (vmNext) {
        this.addVMListeners(vmNext);
      } else {
        console.warn(
          `Prop specified in getViewModel() of ${this.constructor.displayName} ` +
          `component not found in this.props`);
      }
    }
  },

  componentWillMount() {
    this.addVMListeners(this._getViewModel());
  },

  componentWillUnmount() {
    removeVMListeners(this._getViewModel());
  },

  //endregion

  //region event listeners

  addVMListeners(vm) {
    vm.addListener('change', () => this.forceUpdate());
  },

  removeVMListeners(vm) {
    vm.removeAllListeners('change');
  },

  //endregion

  //region helpers

  _getViewModelDef() {
    if (!this.getViewModel || !this.getViewModel()) {
      console.warn(
        `Add getViewModel() method to ${this.constructor.displayName} ` +
        `component and return obj {['prop_name_with_vm']: EventEmitter} ` +
        `or {EventEmitter}.`);

      return {vm: new EventEmitter()};
    }

    let vmDef = this.getViewModel();
    let keys = Object.keys(vmDef);

    let vm = vmDef instanceof EventEmitter ? vmDef : vmDef[keys[0]];
    let vmPropName = vmDef instanceof EventEmitter ? null : keys[0];

    return {vm, vmPropName};
  },

  _getViewModel() {
    let vm = this._getViewModelDef().vm;

    if (!(vm instanceof EventEmitter)) {
      console.warn(
        `VM specified in getViewModel() of ${this.constructor.displayName} ` +
        `component is not EventEmitter`);
      return new EventEmitter();
    }

    return vm;
  },

  _getViewModelPropName() {
    return this._getViewModelDef().vmPropName;
  }

  //endregion

}