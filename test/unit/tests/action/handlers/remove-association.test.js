import {expect} from 'test/utils';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('remove-association', () => {
    
    it('should remove association', () => {

        // target
        const patch = handle(null, {
            type: 'remove-association',
            data: {assocId: 'die'}
        });

        // check
        expect(patch).to.have.length(1);

        const mutation = patch['remove-association'][0];
        expect(mutation.data).to.deep.equal({id: 'die'});
    });

});