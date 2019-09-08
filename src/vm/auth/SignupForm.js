import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

/**
 * Form for signing up (registering, authorization) of new user
 */
export default class SignupForm extends ViewModel {
  /** @type {string} */
  invite;

  /** @type {boolean} */
  isInviteValid = true;

  /** @type {boolean} */
  isInviteVisible = true;

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

  signupButton = {
    enabled: true,
    content: 'Sign up'
  };

  /**
   * Constructor
   * @param {Partial<SignupForm>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
