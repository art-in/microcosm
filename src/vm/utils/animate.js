import required from 'utils/required-params';
import pms from 'utils/pms';

/**
 * Animates numeric value
 * 
 * Each step adds small value to starting value towards target value
 * until reaches it.
 * 
 * @param {object}   opts
 * @param {number}   opts.from     - starting value
 * @param {number}   opts.to       - target value
 * @param {number}   opts.duration - approximate animation duration (ms)
 * @param {function} opts.onStep
 * @return {Promise}
 */
export default function animate(opts) {
    const {from, to, duration, onStep} = required(opts);
    let {scheduleAnimationStep} = opts;

    // made scheduler as optional parameter
    // to be able to pass custom schedulers from tests
    // 1. to test animation timings
    // 2. requestAnimationFrame not called in headless test environment
    scheduleAnimationStep = scheduleAnimationStep || requestAnimationFrame;

    const {promise, resolve, reject} = pms();

    // check params
    const ensureNumber = paramName => {
        const param = opts[paramName];
        if (isNaN(param)) {
            reject(`Invalid '${paramName}' value '${param}'`);
        }
    };

    ensureNumber('from');
    ensureNumber('to');
    ensureNumber('duration');

    // animate
    const range = to - from;
    const startTime = performance.now();
    const endTime = startTime + duration;
    const stepDurations = [];

    const callNextStep = () => {

        const beforeStep = performance.now();
        scheduleAnimationStep(async () => {

            const now = performance.now();
            const timeElapsed = now - startTime;
            const timeRatio = timeElapsed / duration;

            // guess how many more steps we can make, taking
            // into account average duration of previous steps
            const stepDurationSum = stepDurations.reduce((s, d) => s + d, 0);
            const stepDurationAvg = stepDurationSum ?
                stepDurationSum / stepDurations.length : 1;
            const timeLeft = endTime - now;
            const remainingSteps = timeLeft / stepDurationAvg;

            let value;
            if (remainingSteps < 2) {
                // we cannot make at least two full steps,
                // so next one should be the last. jump to target
                value = to;
            } else {
                // progress value linearly
                const valueDelta = range * timeRatio;
                value = from + valueDelta;
            }

            try {
                await onStep(value);
                const stepDuration = performance.now() - beforeStep;
                stepDurations.push(stepDuration);
            } catch (e) {
                reject(e);
                return;
            }

            if (value === to) {
                resolve();
            } else {
                callNextStep();
            }
        });
    };

    if (from === to) {
        resolve();
    } else {
        callNextStep();
    }

    return promise;
}