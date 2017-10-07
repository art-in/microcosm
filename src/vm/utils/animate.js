import required from 'utils/required-params';
import pms from 'utils/pms';

/**
 * Animates numeric value
 * 
 * Each step adds little amount to starting value towards 
 * target value until reaches it
 * Step amount automatically adapted by how fast previous 
 * steps were performed, to call as much steps as possible 
 * in given time period
 * 
 * @param {object} opts
 * @param {number} opts.from - starting value
 * @param {number} opts.to - target value
 * @param {number} opts.duration - approximate animation duration (ms)
 * @param {function} opts.onStep
 * @return {Promise}
 */
export default function animate(opts) {
    const {from, to, duration, onStep} = required(opts);

    const {promise, resolve, reject} = pms();

    const range = to - from;
    const value = from + range * 0.1;

    const endTime = Date.now() + duration;

    const stepDurations = [];

    const callNextStep = value => {
        const timeBefore = Date.now();
        requestAnimationFrame(() => {
            
            try {
                onStep(value);
            } catch (e) {
                reject(e);
                return;
            }

            const timeAfter = Date.now();

            if (value === to) {
                resolve();
            } else {
                const stepDuration = timeAfter - timeBefore;
                stepDurations.push(stepDuration);

                const timeLeft = endTime - Date.now();
               
                if (timeLeft <= 0) {
                    // no time left - jump to target value
                    value = to;
                } else {

                    // guess how much steps we can do
                    // basing on average speed of previous steps
                    const stepDurationAvg = stepDurations.reduce(
                        (sum, cur) => sum + cur, 0) / stepDurations.length;
                    let stepsLeft = timeLeft / stepDurationAvg;
                    stepsLeft = Math.floor(stepsLeft);

                    if (stepsLeft <= 1) {
                        // last step - jump to target value
                        value = to;
                    } else {

                        // approximate next step amount
                        const rangeLeft = to - value;
                        value += rangeLeft / stepsLeft;
                    }
                }

                callNextStep(value);
            }
        });
    };

    callNextStep(value);

    return promise;
}