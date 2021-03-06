import initProps from 'utils/init-props';

/**
 * Lookup suggestion
 */
export default class LookupSuggestion {
  /**
   * Unique id of suggestion
   * @type {string}
   */
  id = Math.random().toString();

  /**
   * Display name
   * @type {string|undefined}
   */
  displayName;

  /**
   * Any data associated with this suggestion
   * @type {*}
   */
  data;

  /**
   * Constructor
   * @param {Partial<LookupSuggestion>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
