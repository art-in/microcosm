import {expect} from 'test/utils';
import {spy} from 'sinon';

import handler from 'src/action/dispatcher';
const handle = handler.dispatch.bind(handler);

describe('on-idea-color-selected', () => {

    it('should dispatch set-idea-color', async () => {

        // setup
        const dispatch = spy();

        // target
        await handle(null, {
            type: 'on-idea-color-selected',
            data: {
                ideaId: 'idea',
                color: 'red'
            }
        }, dispatch);

        // check
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.have.length(1);
        const args = dispatch.firstCall.args[0];
        
        expect(args.type).to.equal('set-idea-color');
        expect(args.data.ideaId).to.equal('idea');
        expect(args.data.color).to.equal('red');
    });

    it('should hide color picker', async () => {
        
        // target
        const patch = await handle(null, {
            type: 'on-idea-color-selected',
            data: {
                ideaId: 'idea',
                color: 'red'
            }
        }, spy());

        // check
        expect(patch['hide-color-picker']).to.exist;
    });

});