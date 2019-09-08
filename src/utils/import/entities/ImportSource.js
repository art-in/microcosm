import initProps from 'utils/init-props';

import NotebookType from 'utils/import/entities/NotebookType';
import ImportSourceType from 'utils/import/entities/ImportSourceType';

/**
 * Import source data
 */
export default class ImportSource {
  /** @type {NotebookType} */
  notebook;

  /** @type {ImportSourceType} */
  type;

  /** @type {string} */
  text;

  /** @type {File} */
  file;

  /**
   * Constructor
   * @param {Partial<ImportSource>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
