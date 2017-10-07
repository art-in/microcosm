import {expect} from 'test/utils';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('show-color-picker-for-idea', () => {

    it('should show color picker', async () => {

        // target
        const patch = await dispatch(null, {
            type: 'show-color-picker-for-idea',
            data: {ideaId: 'idea'}
        });

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('show-color-picker');
        expect(data.onSelectAction).to.be.a('function');
    });

    it(`should set action getter for 'set-idea-color' action`, async () => {

        // setup
        const patch = await dispatch(null, {
            type: 'show-color-picker-for-idea',
            data: {ideaId: 'idea'}
        });

        const {data: {onSelectAction}} = patch[0];
        
        // target
        const action = onSelectAction({color: 'red'});

        expect(action).to.containSubset({
            type: 'set-idea-color',
            data: {
                ideaId: 'idea',
                color: 'red'
            }
        });

    });

    it('should target only vm and view state layers', async () => {
        
        // target
        const patch = await dispatch(null, {
            type: 'show-color-picker-for-idea',
            data: {ideaId: 'idea'}
        });

        // check
        expect(patch.hasTarget('data')).to.be.false;
        expect(patch.hasTarget('model')).to.be.false;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});