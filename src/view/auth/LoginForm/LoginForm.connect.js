import connect from 'view/utils/connect';
import Component from './LoginForm.jsx';

export default connect(
  props => props.form,
  dispatch => ({
    onNameChange: name =>
      dispatch({
        type: 'on-auth-login-form-name-change',
        data: {name}
      }),

    onPasswordChange: password =>
      dispatch({
        type: 'on-auth-login-form-password-change',
        data: {password}
      }),

    onLogin: () => dispatch({type: 'on-auth-login-form-login'})
  })
)(Component);
