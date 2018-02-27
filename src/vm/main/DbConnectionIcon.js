import ViewModel from 'vm/utils/ViewModel';
import Icon from 'vm/shared/Icon';

/**
 * Database connection icon
 */
export default class DbConnectionIcon extends ViewModel {
  /** @type {Icon} */
  icon = Icon.plug;

  /** @type {string} */
  tooltip = undefined;

  /** @type {boolean} */
  isClickable = undefined;
}
