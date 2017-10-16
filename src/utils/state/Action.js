import initProps from 'utils/init-props';

/**
 * Action
 */
export default class Action {

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
     * Constructor
     * @param {object} [opts]
     */
    constructor(opts) {
        initProps(this, opts);
    }

}