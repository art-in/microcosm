import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

/**
 * Form for logging in (signing in, authentication) of existing user
 */
export default class LoginForm extends ViewModel {
  /** @type {string} */
  username;

  /** @type {boolean} */
  isUsernameValid = true;

  /** @type {string} */
  password;

  /** @type {boolean} */
  isPasswordValid = true;

  errorNotification = {
    visible: false,
    message: undefined
  };

  loginButton = {
    enabled: true,
    content: 'Log in'
  };

  /**
   * Constructor
   * @param {Partial<LoginForm>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
