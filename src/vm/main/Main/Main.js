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
  screen;

  /** @type {AuthScreenType} */
  auth;

  /** @type {MindsetType|undefined} */
  mindset;

  /** @type {VersionVmType|undefined} */
  version;

  /**
   * Constructor
   * @param {Partial<Main>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
