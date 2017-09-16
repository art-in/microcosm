import {connect} from 'src/vm/utils/store-connect';

describe('vm', () => {

    beforeEach(() => {
        connect.disconnect();
    });
        
    require('./map');
    require('./mutators');
    require('./utils');

});