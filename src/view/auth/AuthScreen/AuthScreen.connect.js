import connect from 'view/utils/connect';
import Component from './AuthScreen.jsx';

export default connect(
  props => props.auth,
  dispatch => ({
    onModeChange: mode =>
      dispatch({
        type: 'on-auth-screen-mode-change',
        data: {mode}
      })
  })
)(Component);
