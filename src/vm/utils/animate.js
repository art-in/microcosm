import required from 'utils/required-params';
import pms from 'utils/pms';

/**
 * Animates numeric values
 * 
 * Each step adds small value to starting value towards target value
 * until reaches it.
 * 
 * @example
 * await animate({
 *      values: [
 *          {from: 1, to: 2}, // value1
 *          {from: 2, to: -3} // value2
 *      ],
 *      duration: 50,
 *      onStep: ([value1, value2]) => {
 *          // ... handle intermediate values ...
 *      }
 * });
 * 
 * @param {object} opts
 * @param {array.<{from, to}>} opts.values - numeric values
 * @param {number}   opts.duration - approximate animation duration (ms)
 * @param {function} opts.onStep
 * @param {function} [opts.scheduleAnimationStep] - step scheduler
 *                   (default: requestAnimationFrame)
 * @return {Promise}
 */
export default function animate(opts) {
    const {values, duration, onStep} = required(opts);
    let {scheduleAnimationStep} = opts;

    // made scheduler as optional parameter
    // to be able to pass custom schedulers from tests
    // 1. to test animation timings
    // 2. requestAnimationFrame not called in headless test environment
    scheduleAnimationStep = scheduleAnimationStep || requestAnimationFrame;

    // check params
    if (!Array.isArray(values) || values.some(
        val => val == null || typeof val !== 'object' ||
            isNaN(val.from) || isNaN(val.to))) {
        
        return Promise.reject(Error(
            `Invalid values received. Expecting array of {from, to} objects`));
    }

    if (isNaN(duration)) {
        return Promise.reject(Error(
            `Invalid duration value '${duration}'`));
    }

    const {promise, resolve, reject} = pms();

    // animate

    const startTime = performance.now();
    const endTime = startTime + duration;

    const stepDurations = [];

    const ranges = values.map(val => val.to - val.from);

    const callNextStep = () => {

        const beforeStep = performance.now();
        scheduleAnimationStep(async () => {

            const now = performance.now();
            const timeElapsed = now - startTime;
            const timeRatio = timeElapsed / duration;

            // guess how many more steps we can make, taking
            // average duration of previous steps into account
            const stepDurationSum = stepDurations.reduce((s, d) => s + d, 0);
            const stepDurationAvg = stepDurationSum ?
                stepDurationSum / stepDurations.length : 1;
            const timeLeft = endTime - now;
            const remainingSteps = timeLeft / stepDurationAvg;

            let stepValues;
            let done = false;
            if (remainingSteps < 2) {
                // we cannot make at least two full steps,
                // so next one should be the last. jump to target
                stepValues = values.map(val => val.to);
                done = true;
            } else {
                stepValues = values.map((val, idx) => {

                    // progress value linearly
                    const valueDelta = ranges[idx] * timeRatio;
                    return val.from + valueDelta;
                });
            }

            try {
                await onStep(stepValues);

                const stepDuration = performance.now() - beforeStep;
                stepDurations.push(stepDuration);
            } catch (e) {
                reject(e);
                return;
            }

            if (done) {
                resolve();
            } else {
                callNextStep();
            }
        });
    };

    // do not make any steps if start and target values are equal
    const areValuesEqual = values.every(val => val.from === val.to);

    if (areValuesEqual) {
        resolve();
    } else {
        callNextStep();
    }

    return promise;
}