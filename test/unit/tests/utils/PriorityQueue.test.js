import {expect} from 'test/utils';

import PriorityQueue from 'src/utils/PriorityQueue';

describe('PriorityQueue', () => {
  const A = {};
  const B = {};
  const C = {};

  it('should extract item with min priority', () => {
    const queue = new PriorityQueue();

    queue.addWithPriority(B, 2);
    queue.addWithPriority(A, 1);
    queue.addWithPriority(C, 3);

    expect(queue.extractMin()).to.equal(A);
    expect(queue.extractMin()).to.equal(B);
    expect(queue.extractMin()).to.equal(C);

    expect(queue.length).to.equal(0);
  });

  it('should update item priority', () => {
    const queue = new PriorityQueue();

    queue.addWithPriority(B, 2);
    queue.addWithPriority(A, 4);
    queue.addWithPriority(C, 3);

    queue.updatePriority(A, 1);

    expect(queue.extractMin()).to.equal(A);
    expect(queue.extractMin()).to.equal(B);
    expect(queue.extractMin()).to.equal(C);

    expect(queue.length).to.equal(0);
  });

  it('should return queue length', () => {
    const queue = new PriorityQueue();

    queue.addWithPriority(A, 1);
    queue.addWithPriority(B, 2);
    queue.addWithPriority(C, 3);

    expect(queue.length).to.equal(3);
  });

  it('should check if item exists in queue', () => {
    const queue = new PriorityQueue();

    queue.addWithPriority(B, 2);
    queue.addWithPriority(A, 1);
    queue.addWithPriority(C, 3);

    expect(queue.has(A)).to.be.true;
    expect(queue.has(B)).to.be.true;
    expect(queue.has(C)).to.be.true;
    expect(queue.has({})).to.be.false;

    queue.extractMin();
    queue.extractMin();
    queue.extractMin();

    expect(queue.has(A)).to.be.false;
    expect(queue.has(B)).to.be.false;
    expect(queue.has(C)).to.be.false;
  });

  it('should fail when extracting from empty queue', () => {
    const queue = new PriorityQueue();

    expect(() => queue.extractMin()).to.throw(
      'Failed to extract from empty queue'
    );
  });

  it('should fail when updating unknown item', () => {
    const queue = new PriorityQueue();

    queue.addWithPriority(A, 2);
    queue.addWithPriority(B, 1);
    queue.addWithPriority(C, 3);

    expect(() => queue.updatePriority({}, 4)).to.throw(
      `Unknown item '[object Object]' to update priority for`
    );
  });
});
