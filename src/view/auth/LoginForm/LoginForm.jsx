import React, {Component} from 'react';
import cx from 'classnames';

import LoginFormVMType from 'vm/auth/LoginForm';
import Button from 'view/shared/Button';
import getKeyCode from 'view/utils/dom/get-key-code';

import classes from './LoginForm.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {LoginFormVMType} form
 *
 * @prop {function(string)} onUsernameChange
 * @prop {function(string)} onPasswordChange
 * @prop {function()} onLogin
 *
 * @extends {Component<Props>}
 */
export default class LoginForm extends Component {
  onUsernameChange = e => {
    this.props.onUsernameChange(e.target.value);
  };
  onPasswordChange = e => {
    this.props.onPasswordChange(e.target.value);
  };
  onPasswordKeyPress = e => {
    if (getKeyCode(e.nativeEvent) === 'Enter') {
      this.props.onLogin();
    }
  };
  render() {
    const {className, form, onLogin} = this.props;

    return (
      <div className={cx(classes.root, className)}>
        <input
          className={cx(classes.field, {
            [classes.fieldInvalid]: !form.isUsernameValid
          })}
          type="text"
          placeholder="Username"
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus
          value={form.username || ''}
          onChange={this.onUsernameChange}
        />

        <input
          className={cx(classes.field, {
            [classes.fieldInvalid]: !form.isPasswordValid
          })}
          type="password"
          placeholder="Password"
          value={form.password || ''}
          onChange={this.onPasswordChange}
          onKeyPress={this.onPasswordKeyPress}
        />

        {form.errorNotification.visible ? (
          <div className={classes.error}>{form.errorNotification.message}</div>
        ) : null}

        <div className={classes.buttons}>
          <Button onClick={onLogin} disabled={!form.loginButton.enabled}>
            {form.loginButton.content}
          </Button>
        </div>
      </div>
    );
  }
}
