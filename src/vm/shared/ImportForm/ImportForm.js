import ViewModel from 'vm/utils/ViewModel';
import LogType from 'vm/shared/Log';

/**
 * Form for importing data from other systems (eg. from Evernote)
 */
export default class ImportForm extends ViewModel {
  /** @type {string} */
  targetIdeaTitle = undefined;

  /**
   * Source file to import data from
   * @type {File}
   */
  file = undefined;

  /** @type {LogType} */
  log = undefined;

  /** @type {boolean} */
  isInputEnabled = true;

  importButton = {
    enabled: false,
    content: 'Import'
  };
}
