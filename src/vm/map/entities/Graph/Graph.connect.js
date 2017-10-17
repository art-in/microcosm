import {connect} from 'vm/utils/store-connect';

import VM from './Graph';

export default connect(dispatch => ({

    ['link-rightclick']: data => dispatch({
        type: 'show-context-menu-for-association',
        data: {
            pos: data.pos,
            associationId: data.link.id,
            shaded: data.link.shaded
        },
        throttleLog: true
    }),

    ['node-rightclick']: data => dispatch({
        type: 'show-context-menu-for-idea',
        data: {
            pos: data.pos,
            ideaId: data.node.id,
            shaded: data.node.shaded
        },
        throttleLog: true
    }),

    ['context-menu-item-selected']: data => {
        const {menuItem} = data;
        const action = menuItem.onSelectAction();
        action.throttleLog = true;
        dispatch(action);
    },

    ['node-title-change']: data => dispatch({
        type: 'set-idea-value',
        data: {
            ideaId: data.nodeId,
            value: data.title
        },
        throttleLog: true
    }),

    ['viewbox-position-change']: data => dispatch({
        type: 'set-mindmap-position',
        data: {
            mindmapId: data.graphId,
            pos: data.pos
        },
        throttleLog: true
    }),

    ['viewbox-scale-change']: data => dispatch({
        type: 'set-mindmap-scale',
        data: {
            mindmapId: data.graphId,
            scale: data.scale,
            pos: data.pos
        },
        throttleLog: true
    }),

    ['picker-color-change']: data => {
        const {picker, color} = data;
        const action = picker.onSelectAction({color});
        action.throttleLog = true;
        dispatch(action);
    },

    ['node-menu-idea-add']: data => dispatch({
        type: 'create-idea',
        data: {
            parentIdeaId: data.parentIdeaId
        },
        throttleLog: true
    }),

    ['node-menu-idea-remove']: data => dispatch({
        type: 'remove-idea',
        data: {
            ideaId: data.ideaId
        },
        throttleLog: true
    }),

    ['association-tails-lookup-phrase-changed']: data => {
        const {lookup, phrase} = data;
        const action = lookup.onPhraseChangeAction({phrase});
        action.throttleLog = true;
        dispatch(action);
    },
    
    ['association-tails-lookup-suggestion-selected']: data => {
        const {lookup, suggestion} = data;
        const action = lookup.onSelectAction({suggestion});
        action.throttleLog = true;
        dispatch(action);
    },

    ['wheel']: data => dispatch({
        type: 'on-graph-wheel',
        data: {
            pos: data.pos,
            up: data.up
        },
        throttleLog: true
    }),

    ['viewport-resize']: data => dispatch({
        type: 'on-graph-viewport-resize',
        data: {
            size: data.size
        },
        throttleLog: true
    }),

    ['click']: () => dispatch({
        type: 'on-graph-click',
        throttleLog: 5000
    }),

    ['node-mouse-down']: data => dispatch({
        type: 'on-graph-node-mouse-down',
        data: {
            node: data.node,
            button: data.button
        },
        throttleLog: 5000
    }),

    ['mouse-up']: () => dispatch({
        type: 'on-graph-mouse-up',
        throttleLog: 5000
    }),

    ['mouse-move']: data => dispatch({
        type: 'on-graph-mouse-move',
        data: {
            viewportShift: data.viewportShift
        },
        throttleLog: 10000
    }),

    ['mouse-leave']: () => dispatch({
        type: 'on-graph-mouse-leave',
        throttleLog: 5000
    }),

    ['mouse-down']: data => dispatch({
        type: 'on-graph-mouse-down',
        data: {
            button: data.button
        },
        throttleLog: 5000
    }),

    ['key-press']: data => dispatch({
        type: 'on-graph-key-press',
        data: {
            keyCode: data.keyCode
        },
        throttleLog: true
    }),

    ['node-title-double-click']: data => dispatch({
        type: 'on-node-title-double-click',
        data: {
            nodeId: data.nodeId
        },
        throttleLog: true
    }),

    ['node-title-blur']: data => dispatch({
        type: 'on-node-title-blur',
        data: {
            nodeId: data.nodeId
        },
        throttleLog: true
    })

}))(VM);