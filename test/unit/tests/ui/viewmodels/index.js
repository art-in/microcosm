import {connect} from 'src/ui/viewmodels/shared/store-connect';

describe('viewmodels', () => {

    beforeEach(() => {
        connect.disconnect();
    });
        
    require('./graph/Graph.test');
    require('./shared/EventedViewModel.test');
    require('./shared/store-connect.test');

});