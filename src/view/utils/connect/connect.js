import React, {Component} from 'react';
import noop from 'utils/noop';

import ViewModel from 'vm/utils/ViewModel';
import StoreContext from 'view/utils/connect/context';

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

    // eslint-disable-next-line valid-jsdoc
    /**
     * @typedef {object} State
     * @prop {ViewModel} vm
     *
     * @extends {Component<{}, State>}
     */
    class ConnectedComponent extends Component {
      /** @type {State} */
      state = {vm: null};

      static get displayName() {
        return `Connected(${CustomComponent.name})`;
      }

      static getDerivedStateFromProps(nextProps, prevState) {
        const nextVM = getVM(nextProps);

        if (prevState.vm !== nextVM) {
          return {vm: nextVM};
        }

        return null;
      }

      componentDidUpdate(prevProps, prevState) {
        if (this.state.vm !== prevState.vm) {
          if (prevState.vm) {
            // in case new vm instance passed to component,
            // we should unbind previous vm
            prevState.vm.unsubscribe(this.onVMChange);
          }

          this.state.vm.subscribe(this.onVMChange);
        }
      }

      componentDidMount() {
        this.state.vm.subscribe(this.onVMChange);
      }

      componentWillUnmount() {
        this.state.vm.unsubscribe(this.onVMChange);
      }

      onVMChange = vm => {
        // Q: why not just this.forceUpdate() here?
        // A: current approach allows to warn on situations when we receive
        //    change event from prev vm, which ideally should never happen.
        //    also this is recommended async-safe way to handle subscriptions.
        //    https://github.com/facebook/react/tree/master/packages/create-subscription

        this.setState(state => {
          // update only if change belongs to current vm. otherwise ignore.
          if (state.vm === vm) {
            // force update even if target vm is not dirty.
            this.isForcedUpdate = true;
            return {}; // trigger render
          }

          // received change event from prev vm. this can happen because
          // vm-receiving in gDSFP and vm-binding in cDM/cDU may be executed in
          // separate js tasks (render-commit is no longer atomic since v16).
          // ideally this should never happen, but if it does - most likely
          // something goes wrong in upstream vm update process.
          window.console.warn(
            `Component '${CustomComponent.name}' received change event from ` +
              `previous view model. Ignoring update.`
          );
          return null; // do not render
        });
      };

      shouldComponentUpdate(nextProps, nextState) {
        const {vm} = nextState;

        if (this.isForcedUpdate) {
          // update was forced by vm change event
          this.isForcedUpdate = false;
          return true;
        }

        if (nextProps.children) {
          // do not block children updates. connected ones will be dirty checked
          return true;
        }

        // dirty check view model
        return vm.isDirty;
      }

      render() {
        return (
          <StoreContext.Consumer>
            {dispatch => {
              // clean dirty flag on view model
              const vm = this.state.vm;
              vm.isDirty = false;

              // mix connect props
              const connectProps = mapDispatchToProps(dispatch, this.props);

              const props = {
                ...this.props,
                ...connectProps
              };

              return <CustomComponent {...props} />;
            }}
          </StoreContext.Consumer>
        );
      }
    }

    return ConnectedComponent;
  };
}
