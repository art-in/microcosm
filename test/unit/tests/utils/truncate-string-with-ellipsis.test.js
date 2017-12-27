import {expect} from 'test/utils';

import truncate from 'src/utils/truncate-string-with-ellipsis';

describe('truncate-string-with-ellipsis', () => {

    it('should return truncated string with ellipsis', () => {

        const result = truncate('string of 20 chars--', 15);

        expect(result).to.have.length(15);
        expect(result).to.equal('string of 20...');
    });

    it('should return same string if limit equals to source length', () => {
        
        const result = truncate('string of 20 chars--', 20);

        expect(result).to.have.length(20);
        expect(result).to.equal('string of 20 chars--');
    });

    it('should return same string if limit is above source length', () => {
        
        const result = truncate('string of 20 chars--', 25);

        expect(result).to.have.length(20);
        expect(result).to.equal('string of 20 chars--');
    });

    it('should throw error if limit is too small', () => {
        
        const result = () => truncate('string of 20 chars--', 3);

        expect(result).to.throw(`Max length '3' is too small`);
    });

});