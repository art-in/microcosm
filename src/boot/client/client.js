import queryString from 'query-string';

import PouchDB from 'pouchdb';
import PouchDbPluginFind from 'pouchdb-find';
import PouchDbPluginMemory from 'pouchdb-adapter-memory';
PouchDB.plugin(PouchDbPluginFind);
PouchDB.plugin(PouchDbPluginMemory);

import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';

import commonHandler from 'action/handler';
import vmHandler from 'vm/action/handler';
import combine from 'utils/state/combine-mutators';

import State from 'boot/client/State';
import cloneState from 'boot/client/utils/clone-state-safely';

import logger from 'utils/state/middlewares/logger';
import perf from 'utils/state/middlewares/perf';

import mutateData from 'data/mutators';
import mutateModel from 'model/mutators';
import mutateVM from 'vm/mutators';
import mutateView from 'view/mutators';

import './utils/register-sw-cache';

// for devtools Fauxton extension
// @ts-ignore unknown window prop
window.PouchDB = PouchDB;

/**
 * Startup
 */
async function start() {
  const middlewares = [];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger({mapState: cloneState}));
    middlewares.push(perf());
  }

  // load client config. it should take no time, since we sw-caching it
  const clientConfig = await (await window.fetch('api/config')).json();

  // try to get user credentials from query string.
  // only use case for this - is entering as demo user in single link click.
  const query = queryString.parse(window.location.search);
  let userName, userPassword;
  if (query.user && query.pass) {
    userName = query.user;
    userPassword = query.pass;
  }

  // clean up query params
  window.history.pushState(null, '', window.location.pathname);

  // init store
  const store = new Store(
    Handler.combine(commonHandler, vmHandler),
    combine([mutateData, mutateModel, mutateVM, mutateView]),
    new State(),
    middlewares
  );

  // warm up state
  await store.dispatch({
    type: 'init',
    data: {
      // side effects
      fetch: window.fetch,
      setTimeout: window.setTimeout,
      confirm: window.confirm,
      // wrapping instead of binding, otherwise "invalid calling object" in Edge
      reload: () => window.location.reload(),

      // config
      clientConfig,
      apiServerUrl: window.location.href + 'api/',

      // other
      storeDispatch: store.dispatch.bind(store),
      viewRoot: window.document.querySelector('#root'),

      // user credentials
      userName,
      userPassword
    }
  });
}

// Q: why wait for full page load if js bundle is linked to the page tail
//    (so required DOM is already available)?
// A: it fixes FF issue when it gets stuck in page loading state forever
//    because of server database long polling (and in loading state it does not
//    run SMIL animations and draw text-shadow on SVG elements with artifacts).
//
// Q: why not wait for 'DOMContentLoaded'?
// A: FF infinite loading issue get fixed only with 'load'. and since all page
//    content get rendered by code, those two events are always the same.
window.addEventListener('load', start);
