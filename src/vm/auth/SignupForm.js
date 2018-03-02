import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

/**
 * Form for signing up (registering, authorization) of new user
 */
export default class SignupForm extends ViewModel {
  /** @type {string} */
  invite = undefined;

  /** @type {boolean} */
  isInviteValid = true;

  /** @type {boolean} */
  isInviteVisible = true;

  /** @type {string} */
  username = undefined;

  /** @type {boolean} */
  isUsernameValid = true;

  /** @type {string} */
  password = undefined;

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
