import EventedViewModel from 'vm/utils/EventedViewModel';

/**
 * Target store to connect viewmodels to.
 * All connected vm`s will be connected to this store on instantiation.
 *
 * Why introduce module state? It breaks FP style!
 *
 * This is tricky part (pain).
 *
 * We need to spread current store to all connected viewmodels in the app,
 * so they can initiate actions to that store.
 * But we DO NOT want to (a.1) expose global store module to prevent
 * implicit impacts to store, (a.2) couple connector with global store,
 * otherwise vm's will untestable, (b) explicitly pass store from vm to vm
 * down the tree through constructors, because this will expose store
 * to vm internals, while all store story should be done in connectors,
 * and also will force to juggle with store in vm's that
 * should not be connected to store (not all vms are connected), etc.
 * This is rare case when implicit is better then explicit.
 *
 * Eg. 'react-redux' achieve this task through <Provider>, which is based
 * on react's 'context' hack. Which allows to implicitly pass props down
 * to all child components in the subtree. So you should not manually pass
 * store from component to component through props.
 * https://facebook.github.io/react/docs/context.html
 *
 * Pure object tree of vm's does not have this infrastructure to implicitly
 * pass store to all child objects in the subtree.
 *
 * So this module holds target store in its state, and implicitly passes it
 * to all viewmodels connected throught this module.
 *
 * @see connect.to
 */
let targetStore;

/**
 * Connects viewmodel to store
 * 
 * Note: actual connection to store happens when new instance
 * of connected vm created, and not when connect() called.
 *
 * @example
 * class VM extends EventedViewModel {
 *      static eventTypes = ['event']
 * }
 *
 * connect.to(new Store(new Handler(), () => {}));
 *
 * const ConnectedVM = connect(dispatch => ({
 *      ['event 1']: data => dispatch({type: 'action 1', data}),
 *      ['event 2']: data => dispatch({type: 'action 2', data})
 * }))(VM);
 *
 * const vm = new ConnectedVM();
 *
 * @param {function} mapEventsToHandlers - function returning mapping object
 * @param {EventedViewModel} VM
 * @return {ConnectedVM} class
 */
export function connect(mapEventsToHandlers) {
    return VM => {

        if (!(VM.prototype instanceof EventedViewModel)) {
            throw Error(
                `VM '${VM.name}' should be instance of EventedViewModel`);
        }

        /**
         * Wrapper view model
         */
        class ConnectedVM extends VM {

            /**
             * Constructor
             * @param {*} args
             */
            constructor(...args) {
                super(...args);

                this.bind();
            }

            /**
             * Gets display name of view-model type
             * @return {string}
             */
            static get displayName() {
                return `${VM.name}(Connected)`;
            }

            /**
             * Performs binding between vm events and store actions
             */
            bind() {

                if (!targetStore) {
                    throw Error(
                        `VM '${VM.name}' cannot be connected to store, ` +
                        `because store was not set (see connect.to(store))`);
                }

                const eventHandlers = mapEventsToHandlers(
                    targetStore.dispatch.bind(targetStore));

                Object.keys(eventHandlers).forEach(event => {
                    this.on(event, eventHandlers[event]);
                });
            }
        }
        
        return ConnectedVM;
    };
}

/**
 * Sets target store
 * @param {Store} store
 * @return {Store}
 */
connect.to = store => targetStore = store;

/**
 * Clears target store
 * @return {undefined}
 */
connect.disconnect = () => targetStore = undefined;