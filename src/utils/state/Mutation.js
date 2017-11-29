/**
 * Single mutation which can be applied to state
 */
export default class Mutation {

    /**
     * Type of mutation
     * @type {string|undefined}
     */
    type = undefined;

    /**
     * Payload data
     * @type {object|undefined}
     */
    data = undefined;

    /**
     * Target parts of state to mutate
     * If empty - mutation should be allied to whole state
     * @type {Array.<string>|undefined}
     */
    targets = undefined;

    /**
     * Constructor
     * @param {object}         opts
     * @param {string}         opts.type 
     * @param {*}              opts.data 
     * @param {Array.<string>} [opts.targets]
     */
    constructor(opts) {
        const {type, data, targets} = opts;

        this.type = type;
        this.data = data;
        this.targets = targets;
    }

    /**
     * Checks if mutation targets specific target
     * @param {string} target 
     * @return {boolean}
     */
    hasTarget(target) {

        if (!this.targets) {
            return true;
        }

        return this.targets.some(t => t === target);
    }

}