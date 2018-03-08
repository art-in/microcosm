import {expect} from 'test/utils';
import {spy} from 'sinon';
import clone from 'clone';

import noop from 'src/utils/noop';
import combinePatches from 'test/utils/combine-handler-patches';

import State from 'src/boot/client/State';
import ClientConfig from 'src/boot/client/ClientConfig';

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
          confirm: noop,
          reload: noop,
          clientConfig: new ClientConfig(),
          apiServerUrl: 'TEST_API_SERVER',
          storeDispatch: noop,
          viewRoot: window.document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combinePatches(mutate, patch)['init'];

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
          confirm: noop,
          reload: noop,
          clientConfig: new ClientConfig(),
          apiServerUrl: 'TEST_API_SERVER',
          storeDispatch,
          viewRoot: window.document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combinePatches(mutate, patch)['init'];

    expect(mutations).to.have.length(1);
    const mutationData = mutations[0].data;

    expect(mutationData.view.root).to.be.instanceOf(HTMLElement);
    expect(mutationData.view.storeDispatch).to.equal(storeDispatch);
  });

  it('should open login form on first visit', async () => {
    // setup
    const state = new State();

    // simulate first visit
    state.data.dbServerUrl = null;
    state.data.userName = null;

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
          confirm: noop,
          reload: noop,
          clientConfig: new ClientConfig(),
          apiServerUrl: 'TEST_API_SERVER',
          storeDispatch,
          viewRoot: window.document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combinePatches(mutate, patch)['update-main'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.containSubset({
      screen: MainScreen.auth,
      auth: {mode: AuthScreenMode.login}
    });
  });

  it('should open login form if connection not authorized', async () => {
    // setup
    const state = new State();
    state.data.dbServerUrl = 'TEST_DB_SERVER';
    state.data.userName = null;
    state.data.isDbAuthorized = false;

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
          confirm: noop,
          reload: noop,
          clientConfig: new ClientConfig(),
          apiServerUrl: 'TEST_API_SERVER',
          storeDispatch,
          viewRoot: window.document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combinePatches(mutate, patch)['update-main'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.containSubset({
      screen: MainScreen.auth,
      auth: {mode: AuthScreenMode.login}
    });
  });

  it(
    `should open mindset if connection not authorized ` +
      `but server is not reachable`,
    async () => {
      // setup
      const state = new State();
      state.data.dbServerUrl = 'TEST_DB_SERVER';
      state.data.userName = null;
      state.data.isDbAuthorized = false;

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
            confirm: noop,
            reload: noop,
            clientConfig: new ClientConfig(),
            apiServerUrl: 'TEST_API_SERVER',
            storeDispatch,
            viewRoot: window.document.createElement('div')
          }
        },
        dispatch,
        mutate
      );

      // check
      const mutations = combinePatches(mutate, patch)['update-main'];

      expect(mutations).to.have.length(1);
      expect(mutations[0].data).to.containSubset({
        screen: MainScreen.mindset
      });
    }
  );

  it('should open mindset if db was replicated previously', async () => {
    // setup
    const state = new State();
    state.data.dbServerUrl = 'TEST_DB_SERVER';
    state.data.userName = null;

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
          confirm: noop,
          reload: noop,
          clientConfig: new ClientConfig(),
          apiServerUrl: 'TEST_API_SERVER',
          storeDispatch,
          viewRoot: window.document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const mutations = combinePatches(mutate, patch)['update-main'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.containSubset({
      screen: MainScreen.mindset
    });
  });

  it(`should dispatch 'load-mindset' when opening mindset`, async () => {
    // setup
    const state = new State();
    state.data.dbServerUrl = 'TEST_DB_SERVER';
    state.data.userName = 'TEST_USER';

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
          confirm: noop,
          reload: noop,
          clientConfig: new ClientConfig(),
          apiServerUrl: 'TEST_API_SERVER',
          storeDispatch,
          viewRoot: window.document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    const dispatches = dispatch
      .getCalls()
      .filter(c => c.args[0].type === 'load-mindset');

    expect(dispatches).to.have.length(1);
    expect(dispatches[0].args[0].data).to.containSubset({
      sessionDbServerUrl: 'TEST_DB_SERVER',
      sessionUserName: 'TEST_USER'
    });
  });

  it('should NOT mutate state', async () => {
    // setup
    const state = new State();
    const dispatch = noop;
    const mutate = spy();
    const stateBefore = clone(state);

    // target
    await handle(
      state,
      {
        type: 'init',
        data: {
          fetch: noop,
          setTimeout: noop,
          confirm: noop,
          reload: noop,
          reloadToUpdateVersion: noop,
          storeDispatch: noop,
          clientConfig: new ClientConfig(),
          apiServerUrl: 'TEST_API_SERVER',
          viewRoot: window.document.createElement('div')
        }
      },
      dispatch,
      mutate
    );

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  describe('when user credentials provided', () => {
    it('should open login form', async () => {
      // setup
      const state = new State();
      state.data.dbServerUrl = 'TEST_DB_SERVER';
      state.data.userName = 'TEST_USER';

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
            confirm: noop,
            reload: noop,
            clientConfig: new ClientConfig(),
            apiServerUrl: 'TEST_API_SERVER',
            storeDispatch,
            viewRoot: window.document.createElement('div'),

            // pass user credentials
            userName: 'TEST_USER',
            userPassword: 'TEST_PASSWORD'
          }
        },
        dispatch,
        mutate
      );

      // check
      const mutations = combinePatches(mutate, patch)['update-main'];

      expect(mutations).to.have.length(1);
      expect(mutations[0].data).to.containSubset({
        screen: MainScreen.auth,
        auth: {mode: AuthScreenMode.login}
      });
    });

    it('should put user credentials to login form', async () => {
      // setup
      const state = new State();
      state.data.dbServerUrl = 'TEST_DB_SERVER';
      state.data.userName = 'TEST_USER';

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
            confirm: noop,
            reload: noop,
            clientConfig: new ClientConfig(),
            apiServerUrl: 'TEST_API_SERVER',
            storeDispatch,
            viewRoot: window.document.createElement('div'),

            // pass user credentials
            userName: 'TEST_USER',
            userPassword: 'TEST_PASSWORD'
          }
        },
        dispatch,
        mutate
      );

      // check
      const mutations = combinePatches(mutate, patch)['update-auth-screen'];

      expect(mutations).to.have.length(1);
      expect(mutations[0].data).to.containSubset({
        mode: AuthScreenMode.login,
        loginForm: {username: 'TEST_USER', password: 'TEST_PASSWORD'}
      });
    });

    it(`should dispatch 'on-auth-login-form-login'`, async () => {
      // setup
      const state = new State();
      state.data.dbServerUrl = 'TEST_DB_SERVER';
      state.data.userName = 'TEST_USER';

      const dispatch = spy();
      const mutate = noop;
      const storeDispatch = noop;

      // target
      await handle(
        state,
        {
          type: 'init',
          data: {
            fetch: noop,
            setTimeout: noop,
            confirm: noop,
            reload: noop,
            clientConfig: new ClientConfig(),
            apiServerUrl: 'TEST_API_SERVER',
            storeDispatch,
            viewRoot: window.document.createElement('div'),

            // pass user credentials
            userName: 'TEST_USER',
            userPassword: 'TEST_PASSWORD'
          }
        },
        dispatch,
        mutate
      );

      // check
      const dispatches = dispatch
        .getCalls()
        .filter(c => c.args[0].type === 'on-auth-login-form-login');

      expect(dispatches).to.have.length(1);
    });
  });
});
