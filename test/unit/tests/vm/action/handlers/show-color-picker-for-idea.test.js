import {expect} from 'test/utils';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('show-color-picker-for-idea', () => {

    it('should show color picker', () => {

        // target
        const patch = handle(null, {
            type: 'show-color-picker-for-idea',
            data: {ideaId: 'idea'}
        });

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('show-color-picker');
        expect(data.onSelectAction).to.be.a('function');
    });

    it(`should set action getter`, () => {

        // setup
        const patch = handle(null, {
            type: 'show-color-picker-for-idea',
            data: {ideaId: 'idea'}
        });

        const {data: {onSelectAction}} = patch[0];
        
        // target
        const action = onSelectAction({color: 'red'});

        expect(action).to.containSubset({
            type: 'on-idea-color-selected',
            data: {
                ideaId: 'idea',
                color: 'red'
            }
        });

    });

    it('should target only vm and view state layers', () => {
        
        // target
        const patch = handle(null, {
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