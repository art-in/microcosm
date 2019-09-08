import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import AuthScreenModeType from './AuthScreenMode';
import LoginFormType from 'vm/auth/LoginForm';
import SignupFormType from 'vm/auth/SignupForm';

/**
 * Root view model for auth screen (login/registration)
 */
export default class AuthScreen extends ViewModel {
  /** @type {AuthScreenModeType} */
  mode;

  /** @type {LoginFormType} */
  loginForm;

  /** @type {SignupFormType} */
  signupForm;

  /**
   * Constructor
   * @param {Partial<AuthScreen>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
