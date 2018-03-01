import ViewModel from 'vm/utils/ViewModel';

/**
 * Login form
 */
export default class LoginForm extends ViewModel {
  name = {
    /** @type {string} */
    value: undefined,

    /** @type {boolean} */
    isInvalid: false
  };

  password = {
    /** @type {string} */
    value: undefined,

    /** @type {boolean} */
    isInvalid: false
  };

  errorNotification = {
    visible: false,
    message: undefined
  };

  loginButton = {
    enabled: true,
    content: 'Log in'
  };
}
