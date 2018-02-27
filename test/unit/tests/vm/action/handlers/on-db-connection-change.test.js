import {expect} from 'test/utils';

import State from 'src/boot/client/State';
import ConnectionState from 'src/action/utils/ConnectionState';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('on-db-connection-change', () => {
  it('should set icon type to mindset connection icon', () => {
    // setup
    const state = new State();

    // target
    const patch = handle(state, {
      type: 'on-db-connection-change',
      data: {
        connectionState: ConnectionState.connected,
        dbServerUrl: 'TEST_DB_SERVER'
      }
    });

    // check
    const mutations = patch['update-db-connection'];
    expect(mutations).to.have.length(1);

    expect(mutations[0].data.icon).to.exist;
  });

  it('should set tooltip to mindset connection icon', () => {
    // setup
    const state = new State();

    // target
    const patch = handle(state, {
      type: 'on-db-connection-change',
      data: {
        connectionState: ConnectionState.connected,
        dbServerUrl: 'TEST_DB_SERVER'
      }
    });

    // check
    const mutations = patch['update-db-connection'];
    expect(mutations).to.have.length(1);

    expect(mutations[0].data.tooltip).is.not.empty;
  });

  it('should add db server url to tooltip of connection icon', () => {
    // setup
    const state = new State();

    // target
    const patch = handle(state, {
      type: 'on-db-connection-change',
      data: {
        connectionState: ConnectionState.connected,
        dbServerUrl: 'TEST_DB_SERVER'
      }
    });

    // check
    const mutations = patch['update-db-connection'];
    expect(mutations).to.have.length(1);

    expect(mutations[0].data.tooltip).to.contain('TEST_DB_SERVER');
  });

  it('should allow to click db connection icon if unauthorized', () => {
    // setup
    const state = new State();

    // target
    const patch = handle(state, {
      type: 'on-db-connection-change',
      data: {
        connectionState: ConnectionState.unauthorized,
        dbServerUrl: 'TEST_DB_SERVER'
      }
    });

    // check
    const mutations = patch['update-db-connection'];
    expect(mutations).to.have.length(1);

    expect(mutations[0].data.isClickable).to.equal(true);
  });
});
