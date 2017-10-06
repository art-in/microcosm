/**
 * Single mutation which can be applied to application state
 */
export default class Mutation {

    /**
     * Type of mutation
     * @param {string}
     */
    type = undefined;

    /**
     * Payload data
     */
    data = undefined;

    /**
     * Target parts of state to mutate
     * If empty - mutation should be allied to whole state
     * @param {array.<string>}
     */
    targets = undefined;

    /**
     * Constructor
     * @param {object}         opts
     * @param {string}         opts.type 
     * @param {*}              opts.data 
     * @param {array.<string>} opts.targets 
     */
    constructor({type, data, targets}) {
        this.type = type;
        this.data = data;
        this.targets = targets;
    }

    /**
     * Checks if mutation targets specific target
     * @param {string} target 
     * @return {bool}
     */
    hasTarget(target) {

        if (!this.targets) {
            return true;
        }

        return this.targets.some(t => t === target);
    }

}