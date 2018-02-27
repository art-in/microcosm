import React, {Component} from 'react';
import cx from 'classnames';

import LoginFormVMType from 'vm/auth/LoginForm';
import Button from 'view/shared/Button';

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
  render() {
    const {className, form, onLogin} = this.props;

    return (
      <div className={cx(classes.root, className)}>
        <div className={classes.field}>
          <span className={classes.fieldTitle}>Name:</span>
          <input
            className={classes.fieldValue}
            type="text"
            value={form.name || ''}
            onChange={this.onNameChange}
          />
        </div>

        <div className={classes.field}>
          <span className={classes.fieldTitle}>Password:</span>
          <input
            className={classes.fieldValue}
            type="text"
            value={form.password || ''}
            onChange={this.onPasswordChange}
          />
        </div>

        {form.loginError.visible ? (
          <div className={classes.error}>{form.loginError.message}</div>
        ) : null}

        <div className={classes.buttons}>
          <Button onClick={onLogin}>Login</Button>
        </div>
      </div>
    );
  }
}
