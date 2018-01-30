import connect from 'view/utils/connect';
import Component from './IdeaSidebar.jsx';

export default connect(
  props => props.sidebar,
  dispatch => ({
    onGoParent: () =>
      dispatch({
        type: 'on-zen-sidebar-go-parent'
      }),

    onSuccessorSelect: ideaListItem =>
      dispatch({
        type: 'on-zen-sidebar-successor-select',
        data: {ideaId: ideaListItem.id}
      }),

    onToggle: () =>
      dispatch({
        type: 'on-zen-sidebar-toggle'
      })
  })
)(Component);
