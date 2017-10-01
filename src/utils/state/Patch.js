import assert from 'assert';

import Mutation from './Mutation';

/**
 * Application state patch
 * Array(-like) container of mutations, which later can be applied to the state
 *
 * [
 *   {type: 'add idea', data: {...}},            // first mutation
 *   {type: 'remove association', data: {...}}   // second mutation
 * ]
 *
 * Why not just change state directly?
 * It helps to clean business logic from model/db dependencies.
 * This way BL is collection of self-contained pieces of work (FP style).
 * - easy to test
 * - easy to maintain, eg:
 * -- move BL to server side for rest-api
 * -- or log/debug/time-travel state mutations, etc.
 *
 * Considered to extend Array, but due to difficulties
 * only provides subset of native Array func
 * http://perfectionkills.com/
 * how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
 */
export default class Patch {

    mutations = [];

    /**
     * Constructor
     * @param {object} args
     *
     * @example multiple mutations with push
     * const patch = new Patch();
     * patch.push('a', 1);
     * patch.push('b', 2);
     *
     * @example single mutation with constructor
     * const patch = new Patch('a', 1);
     *
     * @example multiple mutations with constructor
     * new Patch([
     *  {type: 'a', data: 1},
     *  {type: 'b', data: 2}
     * ]);
     */
    constructor(...args) {
        if (args.length) {

            const mutations = args[0];
            if (!Array.isArray(mutations)) {
                // single mutation
                this.push(args[0], args[1], args[2]);
            } else {
                // multiple mutations
                mutations.forEach(m => this.push(m.type, m.data, m.targets));
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
     * @param {string} type - mutation type
     * @param {*} [data]
     * @param {array.<string>} [targets] - mutation targets
     */
    push(type, data, targets) {
        
        const mutation = new Mutation(type, data, targets);

        this[this.length] = mutation;

        this.mutations.push(mutation);

        if (!this[type]) {
            this[type] = [];
        }
        this[type].push(mutation);
    }

    /**
     * Combines mutations from several patches to single patch
     * @param {array.<Patch>} patches
     * @return {Patch}
     */
    static combine(...patches) {
        
        patches = patches.filter(p => p !== undefined);

        assert(patches.every(p => p instanceof Patch),
            'Each argument should be instance of Patch');
        
        return patches.reduce(
            (comb, patch) => new Patch([...comb, ...patch]),
            new Patch());
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