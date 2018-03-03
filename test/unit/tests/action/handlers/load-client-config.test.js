import {expect} from 'test/utils';
import {spy} from 'sinon';
import clone from 'clone';

import noop from 'src/utils/noop';
import combineHandlerPatches from 'test/utils/combine-handler-patches';

import State from 'src/boot/client/State';
import ClientConfig from 'boot/client/ClientConfig';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('load-client-config', () => {
  it('should update local config', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const mutate = spy();

    const config = new ClientConfig({signupInviteRequired: true});

    // simulate first visit
    state.data.clientConfig = null;

    // simulate server response
    const fetch = () => ({json: () => clone(config)});

    // target
    const patch = await handle(
      state,
      {
        type: 'load-client-config',
        data: {
          fetch,
          reloadToUpdateVersion: noop,
          apiServerUrl: 'TEST_API_SERVER'
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combineHandlerPatches(mutate, patch)[
      'update-client-config'
    ];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.deep.equal(config);
  });

  it('should skip update on repeated visit if server is not reachable', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const mutate = spy();

    // simulate repeated visit
    state.data.clientConfig = new ClientConfig();

    // simulate unreachable server
    const fetch = 'will throw since not a function';

    // target
    const patch = await handle(
      state,
      {
        type: 'load-client-config',
        data: {
          fetch,
          reloadToUpdateVersion: noop,
          apiServerUrl: 'TEST_API_SERVER'
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combineHandlerPatches(mutate, patch);

    expect(mutations).to.have.length(0);
  });

  it('should skip update if loaded client config equals to local one', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const mutate = spy();

    const config = new ClientConfig();

    // simulate repeated visit
    state.data.clientConfig = config;

    // simulate server response
    const fetch = () => ({json: () => clone(config)});

    // target
    const patch = await handle(
      state,
      {
        type: 'load-client-config',
        data: {
          fetch,
          reloadToUpdateVersion: noop,
          apiServerUrl: 'TEST_API_SERVER'
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combineHandlerPatches(mutate, patch);

    expect(mutations).to.have.length(0);
  });

  it('should confirm page reload after config updated', async () => {
    // setup
    const state = new State();
    const reloadToUpdateVersion = spy(() => true);

    const dispatch = noop;
    const mutate = spy();

    const config = new ClientConfig({signupInviteRequired: true});

    // simulate repeated visit
    state.data.clientConfig = new ClientConfig();

    // simulate server response
    const fetch = () => ({json: () => clone(config)});

    // target
    await handle(
      state,
      {
        type: 'load-client-config',
        data: {
          fetch,
          reloadToUpdateVersion,
          apiServerUrl: 'TEST_API_SERVER'
        }
      },
      dispatch,
      mutate
    );

    // check
    expect(reloadToUpdateVersion.callCount).to.equal(1);
  });

  it('should NOT confirm page reload on first visit', async () => {
    // setup
    const state = new State();
    const reloadToUpdateVersion = spy();

    const dispatch = noop;
    const mutate = spy();

    const config = new ClientConfig({signupInviteRequired: true});

    // simulate first visit
    state.data.clientConfig = null;

    // simulate server response
    const fetch = () => ({json: () => clone(config)});

    // target
    await handle(
      state,
      {
        type: 'load-client-config',
        data: {
          fetch,
          reloadToUpdateVersion,
          apiServerUrl: 'TEST_API_SERVER'
        }
      },
      dispatch,
      mutate
    );

    // check
    expect(reloadToUpdateVersion.callCount).to.equal(0);
  });

  it('should NOT mutate state', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const mutate = spy();

    const config = new ClientConfig({signupInviteRequired: true});

    // simulate first visit
    state.data.clientConfig = null;

    // simulate server response
    const fetch = () => ({json: () => clone(config)});

    const stateBefore = clone(state);

    // target
    await handle(
      state,
      {
        type: 'load-client-config',
        data: {
          fetch,
          reloadToUpdateVersion: noop,
          apiServerUrl: 'TEST_API_SERVER'
        }
      },
      dispatch,
      mutate
    );

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  it('should fail if client config not received on first visit', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const mutate = noop;

    // simulate first visit
    state.data.clientConfig = null;

    // simulate unreachable server
    const fetch = 'will throw since not a function';

    // target
    const result = handle(
      state,
      {
        type: 'load-client-config',
        data: {
          fetch,
          reloadToUpdateVersion: noop,
          apiServerUrl: 'TEST_API_SERVER'
        }
      },
      dispatch,
      mutate
    );

    await expect(result).to.be.rejectedWith('Failed to load client config');
  });
});
