import {EventEmitter} from 'events';
import assert from 'assert';
import React, {Component} from 'react';

/**
 * Binds view component and view-model (EventEmitter).
 * Each 'change' event from model will trigger update of view.
 * 
 * @param {function} mapPropsToVM - (props) => EventEmitter view-model
 * 
 * @example
 * class MyComponent extends Component {
 *      static propTypes = {vm: PropTypes.object};
 *      render() {return <div>this.props.vm.value</div>}
 * }
 * 
 * const MyConnectedComponent = connect(props => props.vm)(MyComponent);
 */
export function connect(mapPropsToVM) {
    return CustomComponent => {

        assert(mapPropsToVM);
        assert(CustomComponent);
        
        // view model getter
        const getVM = props => {
            const vm = mapPropsToVM(props);

            if (!(vm instanceof EventEmitter)) {
                throw Error(
                    `VM of ${CustomComponent.displayName} ` +
                    `component is not EventEmitter`);
            }

            return vm;
        }

        /**
         * Wrapper component
         */
        class VMComponent extends Component {

            constructor(props, ...args) {
                super(props, ...args);

                const vm = getVM(props);

                this.state = {vm};
                this.bindViewModel(vm);
            }

            componentWillReceiveProps(nextProps) {
                
                const nextVM = getVM(nextProps);

                // in case new vm instance passed to component
                // we should rebind it to component
                if (this.state.vm !== nextVM) {
                    this.unbindViewModel(this.state.vm);

                    this.setState({vm: nextVM});
                    this.bindViewModel(nextVM);
                }
            }

            componentWillUnmount() {
                this.unbindViewModel(this.state.vm);
            }

            bindViewModel(vm) {
                vm.addListener('change', () => this.forceUpdate());
            }

            unbindViewModel(vm) {
                // removeListener() is better,
                // but it will require same bind/unbind func (outside class)
                vm.removeAllListeners('change');
            }

            render() {
                return (<CustomComponent {...this.props} />);
            }
        }

        return VMComponent;
    }
}