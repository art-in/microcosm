import initProps from "utils/init-props";

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
   * @param {Partial<Mutation>} props
   */
  constructor(props) {
    initProps(this, props);
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
