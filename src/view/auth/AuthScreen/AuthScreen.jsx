import React, {Component} from 'react';
import cx from 'classnames';

import AuthScreenVmType from 'vm/auth/AuthScreen';
import AuthScreenMode from 'vm/auth/AuthScreenMode';

import LoginForm from 'view/auth/LoginForm';
import SignupForm from 'view/auth/SignupForm';

import classes from './AuthScreen.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {AuthScreenVmType} auth
 * @prop {function(AuthScreenMode)} onModeChange
 *
 * @extends {Component<Props>}
 */
export default class AuthScreen extends Component {
  render() {
    const {className, auth, onModeChange} = this.props;

    let form;
    switch (auth.mode) {
      case AuthScreenMode.login:
        form = <LoginForm className={classes.form} form={auth.loginForm} />;
        break;
      case AuthScreenMode.signup:
        form = <SignupForm className={classes.form} form={auth.signupForm} />;
        break;
      default:
        throw Error(`Unknown auth screen mode '${auth.mode}'`);
    }

    return (
      <div className={cx(classes.root, className)}>
        <div className={classes.dialog}>
          <div className={classes.modes}>
            <span
              className={cx(classes.mode, {
                [classes.active]: auth.mode === AuthScreenMode.login
              })}
              onClick={() => onModeChange(AuthScreenMode.login)}
            >
              Log In
            </span>
            <span
              className={cx(classes.mode, {
                [classes.active]: auth.mode === AuthScreenMode.signup
              })}
              onClick={() => onModeChange(AuthScreenMode.signup)}
            >
              Sign Up
            </span>
          </div>
          {form}
        </div>
      </div>
    );
  }
}
