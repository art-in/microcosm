import CancellationTokenType from 'action/utils/CancellationToken';
import ViewModel from 'vm/utils/ViewModel';
import LogType from 'vm/shared/Log';

export const MESSAGE_CONFIRM_LEAVE =
  'Import still in progress. Cancel and leave anyway?';

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
  isInputEnabled = undefined;

  /** @type {boolean} */
  inProgress = undefined;

  /** @type {CancellationTokenType} */
  token = undefined;

  /** @type {{enabled:boolean, content:string}} */
  importButton = {
    enabled: undefined,
    content: undefined
  };
}
