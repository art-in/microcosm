import initProps from 'utils/init-props';

/**
 * Notebook-agnostic note.
 * Used as intermediate container while importing notes from other notebooks.
 */
export default class Note {
  /** @type {string} */
  title = undefined;

  /** @type {string} markdown string */
  content = undefined;

  /** @type {DateTimeISO} */
  createdOn = undefined;

  /**
   * Constructor
   * @param {Partial<Note>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
