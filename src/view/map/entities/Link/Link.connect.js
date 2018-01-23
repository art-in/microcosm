import connect from "view/utils/connect";
import Component from "./Link.jsx";

export default connect(
  props => props.link,
  (dispatch, props) => ({
    onMouseMove: ({ viewportPos }) =>
      dispatch({
        type: "on-link-mouse-move",
        data: {
          linkId: props.link.id,
          viewportPos
        },
        throttleLog: 5000
      }),

    onMouseLeave: () =>
      dispatch({
        type: "on-link-mouse-leave",
        data: {
          linkId: props.link.id
        },
        throttleLog: 5000
      }),

    onClick: ({ viewportPos }) =>
      dispatch({
        type: "on-link-click",
        data: {
          linkId: props.link.id,
          viewportPos
        },
        throttleLog: 5000
      }),

    onContextMenu: ({ viewportPos }) =>
      dispatch({
        type: "on-link-context-menu",
        data: {
          linkId: props.link.id,
          viewportPos
        }
      })
  })
)(Component);
