import connect from 'view/utils/connect';
import Component from './Mindmap.jsx';

export default connect(
  props => props.mindmap,
  dispatch => ({
    onContextMenuItemSelect: ({item}) =>
      dispatch({
        type: 'on-context-menu-item-select',
        data: {item}
      }),

    onAssociationTailsLookupPhraseChange: ({phrase}) =>
      dispatch({
        type: 'on-association-tails-lookup-phrase-change',
        data: {phrase}
      }),

    onAssociationTailsLookupKeyDown: data =>
      dispatch({
        type: 'on-association-tails-lookup-keydown',
        data
      }),

    onAssociationTailsLookupSuggestionSelect: ({suggestion}) =>
      dispatch({
        type: 'on-association-tails-lookup-suggestion-select',
        data: {suggestion}
      }),

    onWheel: ({up, viewportPos}) =>
      dispatch({
        type: 'on-mindmap-wheel',
        data: {up, viewportPos},
        throttleLog: true
      }),

    onViewportResize: ({size}) =>
      dispatch({
        type: 'on-mindmap-viewport-resize',
        data: {size},
        throttleLog: true
      }),

    onClick: () =>
      dispatch({
        type: 'on-mindmap-click',
        throttleLog: 5000
      }),

    onPointerUp: () =>
      dispatch({
        type: 'on-mindmap-pointer-up',
        throttleLog: 5000
      }),

    onPointerMove: data =>
      dispatch({
        type: 'on-mindmap-pointer-move',
        data,
        throttleLog: 10000
      }),

    onPointerLeave: () =>
      dispatch({
        type: 'on-mindmap-pointer-leave',
        throttleLog: 5000
      })
  })
)(Component);
