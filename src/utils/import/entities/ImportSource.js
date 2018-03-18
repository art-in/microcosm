import initProps from 'utils/init-props';

import NotebookType from 'utils/import/entities/NotebookType';
import ImportSourceType from 'utils/import/entities/ImportSourceType';

/**
 * Import source data
 */
export default class ImportSource {
  /** @type {NotebookType} */
  notebook = undefined;

  /** @type {ImportSourceType} */
  type = undefined;

  /** @type {string} */
  text = undefined;

  /** @type {File} */
  file = undefined;

  /**
   * Constructor
   * @param {Partial<ImportSource>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
