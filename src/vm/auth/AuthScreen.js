import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import AuthScreenModeType from './AuthScreenMode';
import LoginFormType from 'vm/auth/LoginForm';

/**
 * Root view model for auth screen (login/registration)
 */
export default class AuthScreen extends ViewModel {
  /** @type {AuthScreenModeType} */
  mode = undefined;

  /** @type {LoginFormType} */
  loginForm = undefined;

  /**
   * Constructor
   * @param {Partial<AuthScreen>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
