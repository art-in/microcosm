import connect from 'view/utils/connect';
import Component from './SignupForm.jsx';

export default connect(
  props => props.form,
  dispatch => ({
    onInviteChange: invite =>
      dispatch({
        type: 'on-auth-signup-form-invite-change',
        data: {invite}
      }),

    onUsernameChange: username =>
      dispatch({
        type: 'on-auth-signup-form-username-change',
        data: {username}
      }),

    onPasswordChange: password =>
      dispatch({
        type: 'on-auth-signup-form-password-change',
        data: {password}
      }),

    onSignup: () => dispatch({type: 'on-auth-signup-form-signup'})
  })
)(Component);
