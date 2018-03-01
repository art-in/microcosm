import React, {Component} from 'react';
import cx from 'classnames';

import AuthScreenVmType from 'vm/auth/AuthScreen';
import AuthScreenMode from 'vm/auth/AuthScreenMode';

import LoginForm from 'view/auth/LoginForm';

import classes from './AuthScreen.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {AuthScreenVmType} auth
 *
 * @extends {Component<Props>}
 */
export default class Auth extends Component {
  render() {
    const {className, auth} = this.props;

    let form;
    switch (auth.mode) {
      case AuthScreenMode.login:
        form = <LoginForm className={classes.form} form={auth.loginForm} />;
        break;
      default:
        throw Error(`Unknown auth screen mode '${auth.mode}'`);
    }

    return (
      <div className={cx(classes.root, className)}>
        <div className={classes.dialog}>
          <div className={classes.titles}>
            <span className={classes.title}>Login</span>
          </div>
          {form}
        </div>
      </div>
    );
  }
}
