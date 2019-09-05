import sinon from 'sinon';

import {expect} from 'test/utils';

import Patch from 'utils/state/Patch';
import Mutation from 'utils/state/Mutation';

describe('Patch', () => {
  it('should implement Symbol.iterator', () => {
    // setup
    const patch = new Patch();
    patch.push({type: 'type', data: {}});

    // target
    const result = [...patch];

    // check
    expect(result).to.have.length(1);
    expect(result[0]).to.be.instanceOf(Mutation);
  });

  it('should be iterable via forEach', () => {
    // setup
    const patch = new Patch();

    patch.push({type: 't1', data: 'd1'});
    patch.push({type: 't2', data: 'd2'});

    const handler = sinon.spy();

    // target
    patch.forEach(handler);

    // check
    expect(handler.callCount).to.equal(2);

    const firstCallArg = handler.firstCall.args[0];
    const secondCallArg = handler.secondCall.args[0];

    expect(firstCallArg).to.be.instanceOf(Mutation);
    expect(secondCallArg).to.be.instanceOf(Mutation);

    expect(firstCallArg).to.containSubset({type: 't1', data: 'd1'});
    expect(secondCallArg).to.containSubset({type: 't2', data: 'd2'});
  });

  it('should return length', () => {
    // setup
    const patch = new Patch();

    patch.push({type: 'type', data: {}});
    patch.push({type: 'type', data: {}});

    // target
    const result = patch.length;

    // check
    expect(result).to.equal(2);
  });

  it('should be accessible via numeric keys', () => {
    // setup
    const patch = new Patch();

    patch.push({type: 'type 1'});
    patch.push({type: 'type 2'});

    // target/check
    expect(patch[0]).to.be.instanceOf(Mutation);
    expect(patch[1]).to.be.instanceOf(Mutation);

    expect(patch[0]).to.containSubset({type: 'type 1'});
    expect(patch[1]).to.containSubset({type: 'type 2'});
    expect(patch[2]).to.be.undefined;
  });

  it('should be accessible via type keys', () => {
    // setup
    const patch = new Patch();

    patch.push({type: 'type 1', data: {a: '1'}});
    patch.push({type: 'type 1', data: {b: '2'}});
    patch.push({type: 'type 2', data: {c: '3'}});

    // target/check
    expect(patch['type 1']).to.have.length(2);
    expect(patch['type 1'][0]).to.be.instanceOf(Mutation);
    expect(patch['type 1'][1]).to.be.instanceOf(Mutation);
    expect(patch['type 1']).to.containSubset([
      {data: {a: '1'}},
      {data: {b: '2'}}
    ]);

    expect(patch['type 2']).to.have.length(1);
    expect(patch['type 2'][0]).to.be.instanceOf(Mutation);
    expect(patch['type 2']).to.containSubset([{data: {c: '3'}}]);

    expect(patch['type X']).to.be.undefined;
  });

  describe('.constructor()', () => {
    it('should add single mutation', () => {
      // target
      const patch = new Patch({
        type: 'a',
        data: 1,
        targets: ['t']
      });

      // check
      const mutations = [...patch];

      expect(mutations).to.have.length(1);
      expect(mutations[0]).to.be.instanceOf(Mutation);
      expect(mutations[0]).to.containSubset({
        type: 'a',
        data: 1,
        targets: ['t']
      });
    });

    it('should add single mutation (in short form)', () => {
      // target
      const patch = new Patch('a', 1);

      // check
      const mutations = [...patch];

      expect(mutations).to.have.length(1);
      expect(mutations[0]).to.be.instanceOf(Mutation);
      expect(mutations[0]).to.containSubset({
        type: 'a',
        data: 1,
        targets: undefined
      });
    });

    it('should add multiple mutations', () => {
      // target
      const patch = new Patch([
        {type: 'a', data: 1},
        {type: 'b', data: 2, targets: ['t2']}
      ]);

      // check
      const mutations = [...patch];

      expect(mutations).to.have.length(2);

      expect(mutations[0]).to.be.instanceOf(Mutation);
      expect(mutations[1]).to.be.instanceOf(Mutation);

      expect(mutations[0]).to.containSubset({
        type: 'a',
        data: 1,
        targets: undefined
      });
      expect(mutations[1]).to.containSubset({
        type: 'b',
        data: 2,
        targets: ['t2']
      });
    });
  });

  describe('.push()', () => {
    it('should add mutation', () => {
      // setup
      const patch = new Patch();

      // target
      patch.push({type: 'type 1', data: 'data 1'});

      patch.push({
        type: 'type 2',
        data: 'data 2',
        targets: ['target 2']
      });

      patch.push(
        new Mutation({
          type: 'type 3',
          data: 'data 3',
          targets: ['target 3a', 'target 3b']
        })
      );

      patch.push('type 4', 'data 4');

      // check
      const mutations = [...patch];

      expect(mutations).to.have.length(4);

      expect(mutations[0]).to.be.instanceOf(Mutation);
      expect(mutations[1]).to.be.instanceOf(Mutation);
      expect(mutations[2]).to.be.instanceOf(Mutation);
      expect(mutations[3]).to.be.instanceOf(Mutation);

      expect(mutations[0]).to.containSubset({
        type: 'type 1',
        data: 'data 1',
        targets: undefined
      });

      expect(mutations[1]).to.containSubset({
        type: 'type 2',
        data: 'data 2',
        targets: ['target 2']
      });

      expect(mutations[2]).to.containSubset({
        type: 'type 3',
        data: 'data 3',
        targets: ['target 3a', 'target 3b']
      });

      expect(mutations[3]).to.containSubset({
        type: 'type 4',
        data: 'data 4',
        targets: undefined
      });
    });
  });

  describe('.combine()', () => {
    it('should combine mutations to single patch', () => {
      // setup
      const patch1 = new Patch({type: 'mutation 1', data: 'data 1'});
      const patch2 = new Patch({type: 'mutation 2', data: 'data 2'});

      // target
      const result = Patch.combine(patch1, patch2);

      // check
      expect(result).to.have.length(2);
      expect(result['mutation 1']).to.exist;
      expect(result['mutation 2']).to.exist;
    });

    it('should combine array of mutations to single patch', () => {
      // setup
      const patch1 = new Patch({type: 'mutation 1', data: 'data 1'});
      const patch2 = new Patch({type: 'mutation 2', data: 'data 2'});

      // target
      const result = Patch.combine([patch1, patch2]);

      // check
      expect(result).to.have.length(2);
      expect(result['mutation 1']).to.exist;
      expect(result['mutation 2']).to.exist;
    });
  });

  describe('.hasTarget()', () => {
    it('should return true if all mutations has passed target', () => {
      // setup
      const patch = new Patch();

      patch.push({type: 'type 1', targets: ['target X']});
      patch.push({type: 'type 2', targets: ['target X', 'target Y']});
      patch.push({type: 'type 3'}); // all targets

      // target / check
      expect(patch.hasTarget('target X')).to.be.true;
    });

    it('should return false if not all mutations has passed target', () => {
      // setup
      const patch = new Patch();

      patch.push({type: 'type 1', targets: ['target X']});
      patch.push({type: 'type 2', targets: ['target Y']});
      patch.push({type: 'type 3'}); // all targets

      // target / check
      expect(patch.hasTarget('target X')).to.be.false;
    });
  });

  describe('.getTargets()', () => {
    it('should return all targets from all mutations', () => {
      // setup
      const patch = new Patch();

      patch.push({type: 'type 1', targets: ['X']});
      patch.push({type: 'type 2', targets: ['Y', 'Z']});

      // target / check
      expect(patch.getTargets()).to.deep.equal(['X', 'Y', 'Z']);
    });

    it('should return empty array if some mutation has no targets', () => {
      // setup
      const patch = new Patch();

      patch.push({type: 'type 1', targets: ['X']});
      patch.push({type: 'type 2', targets: ['Y', 'Z']});
      patch.push({type: 'type 3'}); // all targets

      // target / check
      expect(patch.getTargets()).to.deep.equal([]);
    });
  });
});
