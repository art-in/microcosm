import {expect} from 'test/utils';
import {spy} from 'sinon';
import noop from 'src/utils/noop';

import State from 'src/boot/client/State';
import ConnectionState from 'src/action/utils/ConnectionState';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('heartbeat', () => {
  it('should start server db connection checks', async () => {
    // setup
    const state = new State();
    const fetch = spy();
    const setTimeout = spy();
    state.sideEffects.fetch = fetch;
    state.sideEffects.setTimeout = setTimeout;
    const dispatch = noop;

    // target
    await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    expect(fetch.callCount).to.equal(1);
    expect(fetch.firstCall.args[0]).to.equal(
      'TEST_DB_SERVER/TEST_USER_mindsets'
    );
  });

  it('should dispatch action on server db connection change', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = spy();

    // target
    await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    expect(dispatch.callCount).to.equal(1);
    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: 'on-db-connection-change',
      data: {
        dbServerUrl: 'TEST_DB_SERVER',
        connectionState: ConnectionState.disconnected
      }
    });
  });
});
