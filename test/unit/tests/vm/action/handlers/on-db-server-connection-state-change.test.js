import {expect} from 'test/utils';

import State from 'src/boot/client/State';
import ConnectionState from 'src/action/utils/ConnectionState';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('on-db-server-connection-state-change', () => {

    it('should set state to mindmap connection state icon', () => {
        
        // setup
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        // target
        const patch = handle(state, {
            type: 'on-db-server-connection-state-change',
            data: {
                connectionState: ConnectionState.connected
            }
        });

        // check
        const mutations = patch['update-mindmap-vm'];
        expect(mutations).to.have.length(1);

        const {dbServerConnectionIcon} = mutations[0].data;

        expect(dbServerConnectionIcon.state)
            .to.equal(ConnectionState.connected);
    });

    it('should set tooltip to mindmap connection state icon', () => {

        // setup
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        // target
        const patch = handle(state, {
            type: 'on-db-server-connection-state-change',
            data: {
                connectionState: ConnectionState.connected
            }
        });

        // check
        const mutations = patch['update-mindmap-vm'];
        expect(mutations).to.have.length(1);

        const {dbServerConnectionIcon} = mutations[0].data;

        expect(dbServerConnectionIcon.tooltip).is.not.empty;
    });

    it('should add db server url to tooltip of connection state icon', () => {

        // setup
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        // target
        const patch = handle(state, {
            type: 'on-db-server-connection-state-change',
            data: {
                connectionState: ConnectionState.connected
            }
        });

        // check
        const mutations = patch['update-mindmap-vm'];
        expect(mutations).to.have.length(1);

        const {dbServerConnectionIcon} = mutations[0].data;

        expect(dbServerConnectionIcon.tooltip).to.contain('TEST_DB_SERVER');
    });

});