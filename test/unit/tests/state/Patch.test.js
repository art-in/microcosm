import sinon from 'sinon';

import {expect} from 'test/utils';

import Patch from 'src/state/Patch';

describe('Patch', () => {

    it('should implement Symbol.iterator', () => {
        
        // setup
        const patch = new Patch();
        patch.push('type', {});

        // target
        const result = [...patch];

        // check
        expect(result).to.deep.equal([{type: 'type', data: {}}]);
    });

    it('should be iteratable via forEach', () => {

        // setup
        const patch = new Patch();

        patch.push('t1', 'd1');
        patch.push('t2', 'd2');

        const handler = sinon.spy();

        // target
        patch.forEach(handler);

        // check
        expect(handler.callCount).to.equal(2);
        
        const firstCallArg = handler.firstCall.args[0];
        const secondCallArg = handler.secondCall.args[0];

        expect(firstCallArg).to.deep.equal({type: 't1', data: 'd1'});
        expect(secondCallArg).to.deep.equal({type: 't2', data: 'd2'});
    });

    it('should return length', () => {

        // setup
        const patch = new Patch();

        patch.push('type', {});
        patch.push('type', {});

        // target
        const result = patch.length;

        // check
        expect(result).to.equal(2);
    });

    it('should be accessible via numeric keys', () => {

        // setup
        const patch = new Patch();

        patch.push('type 1', {});
        patch.push('type 2', {});

        // target/check
        expect(patch[0]).to.deep.equal({type: 'type 1', data: {}});
        expect(patch[1]).to.deep.equal({type: 'type 2', data: {}});
        expect(patch[2]).to.be.undefined;
    });

    it('should be accessible via type keys', () => {

        // setup
        const patch = new Patch();

        patch.push('type 1', {a: '1'});
        patch.push('type 1', {b: '2'});
        patch.push('type 2', {c: '3'});

        // target/check
        expect(patch['type 1']).to.have.length(2);
        expect(patch['type 1']).to.deep.equal([{a: '1'}, {b: '2'}]);

        expect(patch['type 2']).to.have.length(1);
        expect(patch['type 2']).to.deep.equal([{c: '3'}]);

        expect(patch['type X']).to.be.undefined;
    });

    it('should accept single mutation in constructor', () => {

        // target
        const patch = new Patch('a', 1);

        // check
        const mutations = [...patch];

        expect(mutations).to.have.length(1);
        expect(mutations[0]).to.deep.equal({type: 'a', data: 1});
    });

    it('should accept multiple mutations in constructor', () => {

        // target
        const patch = new Patch([
            {type: 'a', data: 1},
            {type: 'b', data: 2}
        ]);

        // check
        const mutations = [...patch];

        expect(mutations).to.have.length(2);
        expect(mutations[0]).to.deep.equal({type: 'a', data: 1});
        expect(mutations[1]).to.deep.equal({type: 'b', data: 2});
    });

    describe('.combine()', () => {

        it('should combine mutations to single patch', () => {

            // setup
            const patch1 = new Patch('mutation 1', {data: 1});
            const patch2 = new Patch('mutation 2', {data: 2});

            // target
            const result = Patch.combine(patch1, patch2);

            // check
            expect(result).to.have.length(2);
        });

    });

});