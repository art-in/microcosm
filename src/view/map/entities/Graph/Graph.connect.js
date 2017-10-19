import connect from 'view/utils/connect';
import Component from './Graph.jsx';

export default connect(
    props => props.graph,
    (dispatch, props) => ({

        onLinkRightClick: ({link, pos}) => dispatch({
            type: 'show-context-menu-for-association',
            data: {
                pos,
                associationId: link.id,
                shaded: link.shaded
            },
            throttleLog: true
        }),

        onNodeRightClick: ({node, pos}) => dispatch({
            type: 'show-context-menu-for-idea',
            data: {
                pos,
                ideaId: node.id,
                shaded: node.shaded
            },
            throttleLog: true
        }),

        onContextMenuItemSelect: ({item}) => {
            const action = item.onSelectAction();
            action.throttleLog = true;
            dispatch(action);
        },

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
            action.throttleLog = true;
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

        onNodeMouseDown: ({node, button}) => dispatch({
            type: 'on-graph-node-mouse-down',
            data: {node, button},
            throttleLog: 5000
        }),

        onMouseUp: () => dispatch({
            type: 'on-graph-mouse-up',
            throttleLog: 5000
        }),

        onMouseMove: ({viewportShift}) => dispatch({
            type: 'on-graph-mouse-move',
            data: {viewportShift},
            throttleLog: 10000
        }),

        onMouseLeave: () => dispatch({
            type: 'on-graph-mouse-leave',
            throttleLog: 5000
        }),

        onMouseDown: ({button}) => dispatch({
            type: 'on-graph-mouse-down',
            data: {button},
            throttleLog: 5000
        }),

        onKeyPress: ({key}) => dispatch({
            type: 'on-graph-key-press',
            data: {key},
            throttleLog: true
        })

    })
)(Component);