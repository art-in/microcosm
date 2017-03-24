import {expect} from 'chai';

import * as storage from 'storage/ideas';

describe('ideas storage', function() {
    
    describe('.get()', () => {

        it('should return array', async () => {
            const result = await storage.get();
            expect(result).to.deep.equal({items: []});
        });

        it('should return array', async () => {
            const result = await storage.get();
            expect(result).to.deep.equal({items: []});
        });

    });

});