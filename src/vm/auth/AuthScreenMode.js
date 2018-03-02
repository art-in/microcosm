/**
 * Auth screen mode
 *
 * @typedef {number} AuthScreenMode
 * @enum {number}
 */
const AuthScreenMode = {
  /** Sign up (register, authorize) new user */
  signup: 0,

  /** Log in (sign in, authenticate) existing user */
  login: 1
};

export default AuthScreenMode;
