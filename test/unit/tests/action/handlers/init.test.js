import {expect} from 'test/utils';
import {spy} from 'sinon';
import clone from 'clone';

import noop from 'src/utils/noop';
import combineHandlerPatches from 'test/utils/combine-handler-patches';

import State from 'src/boot/client/State';
import ClientConfig from 'src/boot/client/config/ClientConfig';

import MainVM from 'src/vm/main/Main';
import MainScreen from 'src/vm/main/MainScreen';
import AuthScreenMode from 'src/vm/auth/AuthScreenMode';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('init', () => {
  it('should init view model state', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const mutate = spy();

    // target
    const patch = await handle(
      state,
      {
        type: 'init',
        data: {
          fetch: noop,
          setTimeout: noop,
          storeDispatch: noop,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          clientConfig: new ClientConfig(),
          viewRoot: document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combineHandlerPatches(mutate, patch)['init'];

    expect(mutations).to.have.length(1);
    const mutationData = mutations[0].data;

    expect(mutationData.vm.main).to.be.instanceOf(MainVM);
  });

  it('should init view state', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const mutate = spy();
    const storeDispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'init',
        data: {
          fetch: noop,
          setTimeout: noop,
          storeDispatch,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          clientConfig: new ClientConfig(),
          viewRoot: document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combineHandlerPatches(mutate, patch)['init'];

    expect(mutations).to.have.length(1);
    const mutationData = mutations[0].data;

    expect(mutationData.view.root).to.be.instanceOf(HTMLElement);
    expect(mutationData.view.storeDispatch).to.equal(storeDispatch);
  });

  it('should open login form on first visit', async () => {
    // setup
    const state = new State();
    state.data.local.dbServerUrl = null;
    state.data.local.userName = null;
    const dispatch = noop;
    const mutate = spy();
    const storeDispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'init',
        data: {
          fetch: noop,
          setTimeout: noop,
          storeDispatch,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          clientConfig: new ClientConfig(),
          viewRoot: document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combineHandlerPatches(mutate, patch)['update-main'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.containSubset({
      screen: MainScreen.auth,
      auth: {mode: AuthScreenMode.login}
    });
  });

  it('should open login form if connection not authorized', async () => {
    // setup
    const state = new State();
    state.data.local.dbServerUrl = 'TEST_DB_SERVER';
    state.data.local.userName = null;
    state.data.local.isDbAuthorized = false;

    // simulate db server is reachable
    state.sideEffects.fetch = async () => new Response(null, {status: 200});

    const dispatch = noop;
    const mutate = spy();
    const storeDispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'init',
        data: {
          fetch: noop,
          setTimeout: noop,
          storeDispatch,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          clientConfig: new ClientConfig(),
          viewRoot: document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combineHandlerPatches(mutate, patch)['update-main'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.containSubset({
      screen: MainScreen.auth,
      auth: {mode: AuthScreenMode.login}
    });
  });

  it(
    `should open mindset if connection not authorized, ` +
      `but server is not reachable`,
    async () => {
      // setup
      const state = new State();
      state.data.local.dbServerUrl = 'TEST_DB_SERVER';
      state.data.local.userName = null;
      state.data.local.isDbAuthorized = false;
      const dispatch = noop;
      const mutate = spy();
      const storeDispatch = noop;

      // simulate db server is NOT reachable
      state.sideEffects.fetch = async () => new Response(null, {status: 500});

      // target
      const patch = await handle(
        state,
        {
          type: 'init',
          data: {
            fetch: noop,
            setTimeout: noop,
            storeDispatch,
            sessionDbServerUrl: 'TEST_DB_SERVER',
            clientConfig: new ClientConfig(),
            viewRoot: document.createElement('div')
          }
        },
        dispatch,
        mutate
      );

      // check
      const mutations = combineHandlerPatches(mutate, patch)['update-main'];

      expect(mutations).to.have.length(1);
      expect(mutations[0].data).to.containSubset({
        screen: MainScreen.mindset
      });
    }
  );

  it('should open mindset if db was replicated previously', async () => {
    // setup
    const state = new State();
    state.data.local.dbServerUrl = 'TEST_DB_SERVER';
    state.data.local.userName = null;
    const dispatch = noop;
    const mutate = spy();
    const storeDispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'init',
        data: {
          fetch: noop,
          setTimeout: noop,
          storeDispatch,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          clientConfig: new ClientConfig(),
          viewRoot: document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combineHandlerPatches(mutate, patch)['update-main'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.containSubset({
      screen: MainScreen.mindset
    });
  });

  it(`should dispatch 'load-mindset' when opening mindset`, async () => {
    // setup
    const state = new State();
    state.data.local.dbServerUrl = 'TEST_DB_SERVER';
    state.data.local.userName = 'TEST_USER';
    const dispatch = spy();
    const mutate = spy();
    const storeDispatch = noop;

    // target
    await handle(
      state,
      {
        type: 'init',
        data: {
          fetch: noop,
          setTimeout: noop,
          storeDispatch,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          clientConfig: new ClientConfig(),
          viewRoot: document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const dispatchLoadMindset = dispatch
      .getCalls()
      .filter(c => c.args[0].type === 'load-mindset');

    expect(dispatchLoadMindset).to.have.length(1);
    expect(dispatchLoadMindset[0].args[0].data).to.containSubset({
      sessionDbServerUrl: 'TEST_DB_SERVER',
      sessionUserName: 'TEST_USER'
    });
  });

  it('should NOT mutate state', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const stateBefore = clone(state);

    const mutate = spy();

    // target
    await handle(
      state,
      {
        type: 'init',
        data: {
          fetch: noop,
          setTimeout: noop,
          storeDispatch: noop,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          clientConfig: new ClientConfig(),
          viewRoot: document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    expect(state).to.deep.equal(stateBefore);
  });
});
