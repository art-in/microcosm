import {expect} from 'test/utils';
import {spy} from 'sinon';

import animate from 'vm/utils/animate';

describe('animate', () => {
  it('should progressively change values towards target', async () => {
    // setup
    const onStep = spy();

    // target
    await animate({
      values: [
        {from: 1, to: 2}, //  A
        {from: -2, to: 0}, // B
        {from: 3, to: -2}, // C
        {from: 1, to: 1} //   D
      ],
      duration: 50,
      onStep,
      scheduleAnimationStep: cb => window.setTimeout(cb, 5)
    });

    // expect
    expect(onStep.called).to.be.true;

    const values = onStep.getCalls().map(c => c.args[0]);

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).to.have.length(4);

      expect(values[i - 1][0]).to.be.lt(values[i][0]); // A
      expect(values[i - 1][1]).to.be.lt(values[i][1]); // B
      expect(values[i - 1][2]).to.be.gt(values[i][2]); // C
      expect(values[i - 1][3]).to.equal(values[i][3]); // D
    }
  });

  it('should pass target values on final step', async () => {
    // setup
    const onStep = spy();

    // target
    await animate({
      values: [
        {from: 1, to: 2}, //  A
        {from: -2, to: 0}, // B
        {from: 3, to: -2} //  C
      ],
      duration: 50,
      onStep,
      scheduleAnimationStep: cb => window.setTimeout(cb, 10)
    });

    // expect
    const finalStepValues = onStep.lastCall.args[0];
    expect(finalStepValues).to.deep.equal([
      2, // A
      0, // B
      -2 // C
    ]);
  });

  it('should NOT pass starting value on first step', async () => {
    // setup
    const onStep = spy();

    // target
    await animate({
      values: [{from: 2, to: 1}],
      duration: 10,
      onStep,
      scheduleAnimationStep: cb => window.setTimeout(cb, 10)
    });

    // expect
    const firstStepValues = onStep.firstCall.args[0];
    expect(firstStepValues[0]).to.not.equal(2);
  });

  it('should NOT make steps if all values are equal', async () => {
    // setup
    const onStep = spy();

    // target
    await animate({
      values: [{from: 1, to: 1}, {from: 2, to: 2}],
      duration: 10,
      onStep,
      scheduleAnimationStep: cb => window.setTimeout(cb, 10)
    });

    // expect
    expect(onStep.called).to.be.false;
  });
});
