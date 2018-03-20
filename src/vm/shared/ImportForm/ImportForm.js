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
  targetIdeaTitle = undefined;

  /**
   * Source file to import data from
   * @type {File}
   */
  file = undefined;

  /** @type {LogType} */
  log = undefined;

  /** @type {boolean} */
  logIsShown = undefined;

  /** @type {boolean} */
  isInputEnabled = undefined;

  /** @type {boolean} */
  inProgress = undefined;

  /** @type {CancellationTokenType} */
  token = undefined;

  /** @type {ProgressBarType} */
  progressBar = undefined;

  /** @type {{enabled:boolean, content:string}} */
  importButton = {
    enabled: undefined,
    content: undefined
  };
}
