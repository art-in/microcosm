import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import MindsetType from 'vm/main/Mindset';
import VersionVmType from 'vm/main/Version';
import AuthScreenType from 'vm/auth/AuthScreen';
import MainScreenType from 'vm/main/MainScreen';

/**
 * Main view model
 *
 * Represents root app component, that can show
 * login form, preferences form, mindset etc.
 */
export default class Main extends ViewModel {
  /** @type {MainScreenType} */
  screen = undefined;

  /** @type {AuthScreenType} */
  auth = undefined;

  /** @type {MindsetType|undefined} */
  mindset = undefined;

  /** @type {VersionVmType|undefined} */
  version = undefined;

  /**
   * Constructor
   * @param {Partial<Main>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
