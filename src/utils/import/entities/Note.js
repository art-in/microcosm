import initProps from 'utils/init-props';

/**
 * Notebook-agnostic note.
 * Used as intermediate container while importing notes from other notebooks.
 */
export default class Note {
  /** @type {string} */
  title;

  /** @type {string} markdown string */
  content;

  /** @type {DateTimeISO} */
  createdOn;

  /**
   * Constructor
   * @param {Partial<Note>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
