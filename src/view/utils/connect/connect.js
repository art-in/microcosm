import React, {Component} from 'react';
import PropTypes from 'prop-types';
import noop from 'utils/noop';

import ViewModel from 'vm/utils/ViewModel';

/**
 * HOC, which connects view component to view-model and store.
 *
 * Does not provide whole state to component (like redux).
 * Parent component should explicitly pass view-model to child.
 *
 * Does not provide automatic updates on state change (like redux).
 * View-model should explicitly emit 'change' event.
 *
 * @param {function(object): ViewModel} mapPropsToVM
 * @param {function} mapDispatchToProps
 * @return {function}
 */
export default function connect(mapPropsToVM, mapDispatchToProps = noop) {
  return CustomComponent => {
    /**
     * View model getter
     * @param {object} props
     * @return {ViewModel} view model
     */
    const getVM = props => {
      const vm = mapPropsToVM(props);

      if (!(vm instanceof ViewModel)) {
        throw Error(
          `VM '${vm}' of '${CustomComponent.name}' ` +
            `component is not EventEmitter`
        );
      }

      return vm;
    };

    /**
     * Wrapper component
     *
     * @typedef {object} Context
     * @prop {function()} dispatch
     *
     * @typedef {object} State
     * @prop {ViewModel} vm
     * @prop {function} onVMChange
     *
     * @extends {Component<{}, State>}
     */
    class ConnectedComponent extends Component {
      constructor(props, ...args) {
        super(props, ...args);

        const vm = getVM(props);
        const onVMChange = this.bindVM(vm);

        this.state = {vm, onVMChange};
      }

      static get displayName() {
        return `Connected(${CustomComponent.name})`;
      }

      /** @type {Context} */
      context;

      // run-time type checks of context is required by react
      static contextTypes = {
        dispatch: PropTypes.func.isRequired
      };

      componentWillReceiveProps(nextProps) {
        const nextVM = getVM(nextProps);
        const {vm, onVMChange} = this.state;

        // in case new vm instance passed to component,
        // we should unbind previous vm and bind new
        if (this.state.vm !== nextVM) {
          this.unbindVM(vm, onVMChange);

          const nextOnVMChange = this.bindVM(nextVM);
          this.setState({
            vm: nextVM,
            onVMChange: nextOnVMChange
          });
        }
      }

      componentWillUnmount() {
        this.unbindVM(this.state.vm, this.state.onVMChange);
      }

      shouldComponentUpdate(nextProps, nextState) {
        const {vm} = nextState;

        // dirty check view model
        let isDirty = vm.isDirty;

        if (nextProps.children) {
          // dynamic children received from props will not get updated
          // if update is prevented (unlike static children), so we
          // either need to compare children shallowly with prev ones,
          // or just force such view model to update.
          // since connected children will be dirty checked before
          // update too, we just forcing parent to update.
          isDirty = true;
        }

        return isDirty;
      }

      /**
       * Binds view-model to view component
       * @param {ViewModel} vm
       * @return {function} view model change handler
       */
      bindVM(vm) {
        // eslint-disable-next-line require-jsdoc
        const onVMChange = () =>
          // forceUpdate will only skip shouldComponentUpdate for
          // this wrapper component, while child components will
          // still receive all normal lifecycle hooks.
          this.forceUpdate();

        vm.subscribe(onVMChange);

        return onVMChange;
      }

      /**
       * Unbinds view-model from view component
       * @param {ViewModel} vm
       * @param {function} onVMChange
       */
      unbindVM(vm, onVMChange) {
        vm.unsubscribe(onVMChange);
      }

      render() {
        // clean dirty flag on view model
        const vm = this.state.vm;
        vm.isDirty = false;

        // mix connect props
        const dispatch = this.context.dispatch;
        const connectProps = mapDispatchToProps(dispatch, this.props);

        const props = {
          ...this.props,
          ...connectProps
        };

        return <CustomComponent {...props} />;
      }
    }

    return ConnectedComponent;
  };
}
