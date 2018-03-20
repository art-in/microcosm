import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';
import ProgressBarStyle from 'vm/shared/ProgressBarStyle';

/**
 * Progress bar
 */
export default class ProgressBar extends ViewModel {
  /** @type {boolean} */
  inProgress = false;

  /** @type {ProgressBarStyle} */
  style = ProgressBarStyle.disabled;

  /** @type {number} progress in percents */
  progress = 100;

  /**
   * Constructor
   * @param {Partial<ProgressBar>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
