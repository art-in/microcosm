import CancellationTokenType from 'action/utils/CancellationToken';
import ViewModel from 'vm/utils/ViewModel';
import LogType from 'vm/shared/Log';
import ProgressBarType from 'vm/shared/ProgressBar';

export const MESSAGE_CONFIRM_LEAVE = 'Import is in progress. Cancel and leave?';

/**
 * Form for importing data from other systems (eg. from Evernote)
 */
export default class ImportForm extends ViewModel {
  /** @type {string} */
  targetIdeaTitle;

  /**
   * Source file to import data from
   * @type {File}
   */
  file;

  /** @type {LogType} */
  log;

  /** @type {boolean} */
  logIsShown;

  /** @type {boolean} */
  isInputEnabled;

  /** @type {boolean} */
  inProgress;

  /** @type {CancellationTokenType} */
  token;

  /** @type {ProgressBarType} */
  progressBar;

  /** @type {{enabled:boolean, content:string}} */
  importButton = {
    enabled: undefined,
    content: undefined
  };
}
