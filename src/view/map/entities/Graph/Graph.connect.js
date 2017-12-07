import connect from 'view/utils/connect';
import Component from './Graph.jsx';

export default connect(
    props => props.graph,
    (dispatch, props) => ({

        onLinkRightClick: ({linkId, pos}) => dispatch({
            type: 'show-context-menu-for-association',
            data: {
                pos,
                associationId: linkId
            },
            throttleLog: true
        }),

        onNodeRightClick: ({nodeId, pos}) => dispatch({
            type: 'show-context-menu-for-idea',
            data: {
                pos,
                ideaId: nodeId
            },
            throttleLog: true
        }),

        onContextMenuItemSelect: ({item}) => dispatch({
            type: 'on-context-menu-item-select',
            data: {item}
        }),

        onAssociationTailsLookupPhraseChange: ({phrase}) => dispatch({
            type: 'on-association-tails-lookup-phrase-change',
            data: {phrase}
        }),

        onAssociationTailsLookupKeyDown: ({key}) => dispatch({
            type: 'on-association-tails-lookup-keydown',
            data: {key}
        }),

        onAssociationTailsLookupSuggestionSelect: ({suggestion}) => dispatch({
            type: 'on-association-tails-lookup-suggestion-select',
            data: {suggestion}
        }),

        onColorPickerChange: ({color}) => {
            const picker = props.graph.colorPicker;
            const action = picker.onSelectAction({color});
            dispatch(action);
        },

        onWheel: ({up, pos}) => dispatch({
            type: 'on-graph-wheel',
            data: {up, pos},
            throttleLog: true
        }),

        onViewportResize: ({size}) => dispatch({
            type: 'on-graph-viewport-resize',
            data: {size},
            throttleLog: true
        }),

        onClick: () => dispatch({
            type: 'on-graph-click',
            throttleLog: 5000
        }),

        onNodeMouseDown: ({nodeId, button}) => dispatch({
            type: 'on-graph-node-mouse-down',
            data: {nodeId, button},
            throttleLog: 5000
        }),

        onMouseUp: () => dispatch({
            type: 'on-graph-mouse-up',
            throttleLog: 5000
        }),

        onMouseMove: ({viewportShift, pressedMouseButton}) => dispatch({
            type: 'on-graph-mouse-move',
            data: {viewportShift, pressedMouseButton},
            throttleLog: 10000
        }),

        onMouseLeave: () => dispatch({
            type: 'on-graph-mouse-leave',
            throttleLog: 5000
        }),

        onKeyDown: ({key, ctrlKey}) => dispatch({
            type: 'on-graph-key-down',
            data: {key, ctrlKey},
            throttleLog: true
        })

    })
)(Component);