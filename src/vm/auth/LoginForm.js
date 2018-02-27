import ViewModel from 'vm/utils/ViewModel';

/**
 * Login form
 */
export default class LoginForm extends ViewModel {
  /** @type {string} */
  name = undefined;

  /** @type {string} */
  password = undefined;

  /**
   * Login error section which notifies user if login failed
   * @type {{visible, message}}
   */
  loginError = {
    visible: false,
    message: undefined
  };
}
