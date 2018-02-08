import connect from 'view/utils/connect';
import Component from './Node.jsx';

export default connect(
  props => props.node,
  (dispatch, props) => ({
    onClick: () =>
      dispatch({
        type: 'on-node-click',
        data: {
          nodeId: props.node.id
        }
      }),

    onContextMenu: () =>
      dispatch({
        type: 'on-node-context-menu',
        data: {
          nodeId: props.node.id
        }
      }),

    onPointerDown: ({button}) =>
      dispatch({
        type: 'on-mindmap-node-pointer-down',
        data: {
          nodeId: props.node.id,
          button
        }
      })
  })
)(Component);
