import {expect} from 'test/utils';

import State from 'src/boot/client/State';
import ConnectionState from 'src/action/utils/ConnectionState';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('on-db-server-connection-state-change', () => {
  it('should set icon type to mindset connection state icon', () => {
    // setup
    const state = new State();

    // target
    const patch = handle(state, {
      type: 'on-db-server-connection-state-change',
      data: {
        connectionState: ConnectionState.connected,
        dbServerUrl: 'TEST_DB_SERVER'
      }
    });

    // check
    const mutations = patch['update-mindset-vm'];
    expect(mutations).to.have.length(1);

    const {dbServerConnectionIcon} = mutations[0].data;

    expect(dbServerConnectionIcon.icon).to.exist;
  });

  it('should set tooltip to mindset connection state icon', () => {
    // setup
    const state = new State();

    // target
    const patch = handle(state, {
      type: 'on-db-server-connection-state-change',
      data: {
        connectionState: ConnectionState.connected,
        dbServerUrl: 'TEST_DB_SERVER'
      }
    });

    // check
    const mutations = patch['update-mindset-vm'];
    expect(mutations).to.have.length(1);

    const {dbServerConnectionIcon} = mutations[0].data;

    expect(dbServerConnectionIcon.tooltip).is.not.empty;
  });

  it('should add db server url to tooltip of connection state icon', () => {
    // setup
    const state = new State();

    // target
    const patch = handle(state, {
      type: 'on-db-server-connection-state-change',
      data: {
        connectionState: ConnectionState.connected,
        dbServerUrl: 'TEST_DB_SERVER'
      }
    });

    // check
    const mutations = patch['update-mindset-vm'];
    expect(mutations).to.have.length(1);

    const {dbServerConnectionIcon} = mutations[0].data;

    expect(dbServerConnectionIcon.tooltip).to.contain('TEST_DB_SERVER');
  });
});
