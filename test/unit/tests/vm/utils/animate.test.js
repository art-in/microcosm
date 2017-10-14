import {expect} from 'test/utils';
import {spy} from 'sinon';

import animate from 'vm/utils/animate';

describe('animate', () => {

    it('should progressively change target value', async () => {

        // setup
        const onStep = spy();

        // target
        await animate({
            from: 1,
            to: 2,
            duration: 50,
            onStep,
            scheduleAnimationStep: cb => setTimeout(cb, 5)
        });

        // expect
        expect(onStep.called).to.be.true;

        const values = onStep.getCalls().map(c => c.args[0]);

        // every previous value should be smaller than next value 
        for (let i = 1; i < values.length; i++) {
            expect(values[i - 1]).to.be.lte(values[i]);
        }
    });

    it('should pass target value on final step', async () => {
        
        // setup
        const onStep = spy();

        // target
        await animate({
            from: 2,
            to: -1,
            duration: 50,
            onStep,
            scheduleAnimationStep: cb => setTimeout(cb, 10)
        });

        // expect
        expect(onStep.lastCall.args[0]).to.equal(-1);
    });

    it('should NOT pass starting value on first step', async () => {
        
        // setup
        const onStep = spy();

        // target
        await animate({
            from: 2,
            to: 1,
            duration: 10,
            onStep,
            scheduleAnimationStep: cb => setTimeout(cb, 10)
        });

        // expect
        expect(onStep.firstCall.args[0]).to.not.equal(2);
    });

    it('should NOT make steps if values are equal', async () => {
        
        // setup
        const onStep = spy();

        // target
        await animate({
            from: 1,
            to: 1,
            duration: 10,
            onStep,
            scheduleAnimationStep: cb => setTimeout(cb, 10)
        });

        // expect
        expect(onStep.called).to.be.false;
    });

    it(`should fail if invalid starting value`, async () => {
        
        // setup
        const onStep = spy();

        // target
        const promise = animate({
            from: undefined,
            to: 1,
            duration: 10,
            onStep,
            scheduleAnimationStep: cb => setTimeout(cb, 10)
        });

        // expect
        await expect(promise).to.be.rejectedWith(
            `Invalid 'from' value 'undefined'`);
    });

    it(`should fail if invalid target value`, async () => {
        
        // setup
        const onStep = spy();

        // target
        const promise = animate({
            from: 1,
            to: 'X',
            duration: 10,
            onStep,
            scheduleAnimationStep: cb => setTimeout(cb, 10)
        });

        // expect
        await expect(promise).to.be.rejectedWith(
            `Invalid 'to' value 'X'`);
    });

    it(`should fail if invalid duration`, async () => {
        
        // setup
        const onStep = spy();

        // target
        const promise = animate({
            from: 1,
            to: 2,
            duration: NaN,
            onStep,
            scheduleAnimationStep: cb => setTimeout(cb, 10)
        });

        // expect
        await expect(promise).to.be.rejectedWith(
            `Invalid 'duration' value 'NaN'`);
    });

});