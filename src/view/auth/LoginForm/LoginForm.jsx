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
 * @prop {function(string)} onNameChange
 * @prop {function(string)} onPasswordChange
 * @prop {function()} onLogin
 *
 * @extends {Component<Props>}
 */
export default class LoginForm extends Component {
  onNameChange = e => {
    this.props.onNameChange(e.target.value);
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
        <div className={classes.field}>
          <input
            className={cx(classes.fieldValue, {
              [classes.fieldValueInvalid]: form.name.isInvalid
            })}
            type="text"
            placeholder="Username"
            autoCapitalize="off"
            autoCorrect="off"
            autoFocus
            ref={node => (this.inputName = node)}
            value={form.name.value || ''}
            onChange={this.onNameChange}
          />
        </div>

        <div className={classes.field}>
          <input
            className={cx(classes.fieldValue, {
              [classes.fieldValueInvalid]: form.name.isInvalid
            })}
            type="password"
            placeholder="Password"
            ref={node => (this.inputPassword = node)}
            value={form.password.value || ''}
            onChange={this.onPasswordChange}
            onKeyPress={this.onPasswordKeyPress}
          />
        </div>

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
