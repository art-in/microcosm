import dedup from 'utils/dedup-array';

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
 * const patch = new Patch()
 * patch.push({type: 'a', data: 1})
 * patch.push({type: 'b', data: 2, targets: ['vm', 'view']})
 * patch.push('c', 3)
 *
 * @example single mutation with constructor
 * const patch = new Patch({type: 'a', data: 1})
 * const patch = new Patch('b', 2)
 *
 * @example multiple mutations with constructor
 * new Patch([
 *  {type: 'a', data: 1},
 *  {type: 'b', data: 2}
 * ])
 *
 * @extends {Array}
 */
export default class Patch {
  /**
   * Mutations
   * @type {Array.<Mutation>}
   */
  mutations = [];

  /**
   * Constructor
   * @param {Array.<Mutation>|Mutation|Array.<object>|object} [mutations]
   * @param {array} rest
   */
  constructor(mutations, ...rest) {
    if (mutations) {
      if (!Array.isArray(mutations)) {
        // single mutation
        this.push(mutations, ...rest);
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
   * @param {function(Mutation)} func
   * @param {array} [args]
   * @return {*}
   */
  forEach(func, ...args) {
    return this.mutations.forEach(func, ...args);
  }

  /**
   * Map mutations
   * @param {function(Mutation)} func
   * @param {array} [args]
   * @return {*}
   */
  map(func, ...args) {
    return this.mutations.map(func, ...args);
  }

  /**
   * Filter mutations
   * @param {function(Mutation)} func
   * @param {array} [args]
   * @return {Array.<Mutation>}
   */
  filter(func, ...args) {
    return this.mutations.filter(func, ...args);
  }

  /**
   * Adds mutations
   * @param {Mutation|object} mutation
   */
  push(mutation, ...rest) {
    if (!(mutation instanceof Mutation)) {
      if (typeof mutation === 'string') {
        mutation = new Mutation({type: mutation, data: rest[0]});
      } else {
        mutation = new Mutation(mutation);
      }
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
   * @param {Array.<Patch|Array.<Patch>>} patches
   * @return {Patch}
   */
  static combine(...patches) {
    // flatten arrays
    // @ts-ignore res is array and concat is valid function here
    patches = patches.reduce((res, a) => res.concat(a), []);

    patches = patches.filter(p => p !== undefined);

    const mutations = patches.reduce((comb, patch) => [...comb, ...patch], []);

    return new Patch(mutations);
  }

  /**
   * Checks if all mutations has this target
   * @param {string} target
   * @return {boolean}
   */
  hasTarget(target) {
    // TODO: revisit. from method signature it's more appropriate
    //       to test for 'some' here, not 'every'
    return this.mutations.every(m => m.hasTarget(target));
  }

  /**
   * Gets all unique targets from all mutations
   * @return {array} empty if at least one underlying mutation
   *                 targets whole state
   */
  getTargets() {
    let mutationTargets = this.map(m => m.targets);

    if (mutationTargets.some(targets => targets === undefined)) {
      // one of mutations has no specific target (targets whole state),
      // then parent patch targets whole state too.
      return [];
    }

    // flatten arrays
    mutationTargets = mutationTargets.reduce(
      (acc, targets) => acc.concat(targets),
      []
    );

    return dedup(mutationTargets);
  }
}
