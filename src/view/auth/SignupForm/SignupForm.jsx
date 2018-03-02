import React, {Component} from 'react';
import cx from 'classnames';

import SignupFormVMType from 'vm/auth/SignupForm';
import Button from 'view/shared/Button';
import getKeyCode from 'view/utils/dom/get-key-code';

import classes from './SignupForm.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {SignupFormVMType} form
 *
 * @prop {function(string)} onInviteChange
 * @prop {function(string)} onUsernameChange
 * @prop {function(string)} onPasswordChange
 * @prop {function()} onSignup
 *
 * @extends {Component<Props>}
 */
export default class SignupForm extends Component {
  onInviteChange = e => {
    this.props.onInviteChange(e.target.value);
  };
  onUsernameChange = e => {
    this.props.onUsernameChange(e.target.value);
  };
  onPasswordChange = e => {
    this.props.onPasswordChange(e.target.value);
  };
  onPasswordKeyPress = e => {
    if (getKeyCode(e.nativeEvent) === 'Enter') {
      this.props.onSignup();
    }
  };
  render() {
    const {className, form, onSignup} = this.props;

    return (
      <div className={cx(classes.root, className)}>
        {form.isInviteVisible ? (
          <input
            className={cx(classes.field, {
              [classes.fieldInvalid]: !form.isInviteValid
            })}
            placeholder="Invite code"
            autoCapitalize="off"
            autoCorrect="off"
            value={form.invite || ''}
            onChange={this.onInviteChange}
          />
        ) : null}

        <input
          className={cx(classes.field, {
            [classes.fieldInvalid]: !form.isUsernameValid
          })}
          type="text"
          placeholder="Username"
          autoCapitalize="off"
          autoCorrect="off"
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
          <Button onClick={onSignup} disabled={!form.signupButton.enabled}>
            {form.signupButton.content}
          </Button>
        </div>
      </div>
    );
  }
}
