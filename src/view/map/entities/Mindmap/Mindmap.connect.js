import connect from 'view/utils/connect';
import Component from './Mindmap.jsx';

export default connect(
    props => props.mindmap,
    (dispatch, props) => ({

        onContextMenuItemSelect: ({item}) => dispatch({
            type: 'on-context-menu-item-select',
            data: {item}
        }),

        onAssociationTailsLookupPhraseChange: ({phrase}) => dispatch({
            type: 'on-association-tails-lookup-phrase-change',
            data: {phrase}
        }),

        onAssociationTailsLookupKeyDown: data => dispatch({
            type: 'on-association-tails-lookup-keydown',
            data
        }),

        onAssociationTailsLookupSuggestionSelect: ({suggestion}) => dispatch({
            type: 'on-association-tails-lookup-suggestion-select',
            data: {suggestion}
        }),

        onColorPickerChange: ({color}) => {
            const picker = props.mindmap.colorPicker;
            const action = picker.onSelectAction({color});
            dispatch(action);
        },

        onWheel: ({up, viewportPos}) => dispatch({
            type: 'on-mindmap-wheel',
            data: {up, viewportPos},
            throttleLog: true
        }),

        onViewportResize: ({size}) => dispatch({
            type: 'on-mindmap-viewport-resize',
            data: {size},
            throttleLog: true
        }),

        onClick: () => dispatch({
            type: 'on-mindmap-click',
            throttleLog: 5000
        }),

        onMouseUp: () => dispatch({
            type: 'on-mindmap-mouse-up',
            throttleLog: 5000
        }),

        onMouseMove: ({viewportShift, pressedMouseButton}) => dispatch({
            type: 'on-mindmap-mouse-move',
            data: {viewportShift, pressedMouseButton},
            throttleLog: 10000
        }),

        onMouseLeave: () => dispatch({
            type: 'on-mindmap-mouse-leave',
            throttleLog: 5000
        })

    })
)(Component);