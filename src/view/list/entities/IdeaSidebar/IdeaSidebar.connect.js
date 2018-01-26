import connect from 'view/utils/connect';
import Component from './IdeaSidebar.jsx';

export default connect(
  props => props.sidebar,
  dispatch => ({
    onGoParent: () =>
      dispatch({
        type: 'on-mindlist-sidebar-go-parent'
      }),
    onSuccessorSelect: ideaListItem =>
      dispatch({
        type: 'on-mindlist-sidebar-successor-select',
        data: {ideaId: ideaListItem.id}
      })
  })
)(Component);
