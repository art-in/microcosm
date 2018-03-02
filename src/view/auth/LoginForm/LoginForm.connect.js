import connect from 'view/utils/connect';
import Component from './LoginForm.jsx';

export default connect(
  props => props.form,
  dispatch => ({
    onUsernameChange: username =>
      dispatch({
        type: 'on-auth-login-form-username-change',
        data: {username}
      }),

    onPasswordChange: password =>
      dispatch({
        type: 'on-auth-login-form-password-change',
        data: {password}
      }),

    onLogin: () => dispatch({type: 'on-auth-login-form-login'})
  })
)(Component);
