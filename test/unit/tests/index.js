import Store from 'utils/state/Store';
import Dispatcher from 'utils/state/Dispatcher';
import {connect} from 'src/vm/utils/store-connect';

beforeEach(() => {
    // viewmodels cannot be initialized without global store connection.
    // global store is a pain (see store-connect),
    // instead of connect/disconnect personaly for each vm test,
    // let this live in one place here
    connect.to(new Store(new Dispatcher(), () => {}));
});

afterEach(() => {
    connect.disconnect();
});

require('./action');

require('./data');

require('./model');

require('./utils');

require('./view');

require('./vm');