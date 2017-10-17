import assert from 'utils/assert';

import Mutation from './Mutation';

/**
 * Container of mutations, which later can be applied to the state
 * 
 * Considered to extend Array, but due to difficulties
 * only provides subset of native Array funcs (push, map, forEach)
 * http://perfectionkills.com/
 * how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
 * 
 * @example multiple mutations with push
 * const patch = new Patch();
 * patch.push({type: 'a', data: 1});
 * patch.push({type: 'b', data: 2, targets: ['vm', 'view']});
 *
 * @example single mutation with constructor
 * const patch = new Patch({type: 'a', data: 1});
 *
 * @example multiple mutations with constructor
 * new Patch([
 *  {type: 'a', data: 1},
 *  {type: 'b', data: 2}
 * ]);
 */
export default class Patch {

    mutations = [];

    /**
     * Constructor
     * @param {array.<Mutation>|Mutation} [mutations]
     */
    constructor(mutations) {
        if (mutations) {
            if (!Array.isArray(mutations)) {
                // single mutation
                this.push(mutations);
            } else {
                // multiple mutations
                mutations.forEach(m => this.push(m));
            }
        }
    }

    /**
     * Gets number of mutations
     * @return {number}
     */
    get length() {
        return this.mutations.length;
    }

    /**
     * Gets iterator
     * @return {object}
     */
    [Symbol.iterator]() {
        return this.mutations[Symbol.iterator]();
    }

    /**
     * Iterates over mutations
     * @param {*} args
     * @return {*}
     */
    forEach(...args) {
        return this.mutations.forEach(...args);
    }

    /**
     * Map mutations
     * @param {*} args
     * @return {*}
     */
    map(...args) {
        return this.mutations.map(...args);
    }

    /**
     * Adds mutations
     * @param {Mutation|object} mutation
     */
    push(mutation) {
        
        if (!(mutation instanceof Mutation)) {
            // TODO: validate param scheme
            mutation = new Mutation(mutation);
        }

        this[this.length] = mutation;

        this.mutations.push(mutation);

        if (!this[mutation.type]) {
            this[mutation.type] = [];
        }
        this[mutation.type].push(mutation);
    }

    /**
     * Combines mutations from several patches to single patch
     * @param {array.<Patch>} patches
     * @return {Patch}
     */
    static combine(...args) {
        
        // flatten arrays
        let patches = args.reduce((res, a) => res.concat(a), []);

        patches = patches.filter(p => p !== undefined);

        assert(patches.every(p => p instanceof Patch),
            'Each argument should be instance of Patch');
        
        const mutations = patches.reduce(
            (comb, patch) => ([...comb, ...patch]), []);

        return new Patch(mutations);
    }

    /**
     * Checks if all mutations has this target
     * @param {string} target 
     * @return {bool}
     */
    hasTarget(target) {
        return this.mutations.every(m => m.hasTarget(target));
    }

}