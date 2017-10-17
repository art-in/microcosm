import {connect} from 'vm/utils/store-connect';

import VM from './Graph';

export default connect(dispatch => ({

    ['link-rightclick']: data => dispatch({
        type: 'show-context-menu-for-association',
        data: {
            pos: data.pos,
            associationId: data.link.id,
            shaded: data.link.shaded
        }
    }),

    ['node-rightclick']: data => dispatch({
        type: 'show-context-menu-for-idea',
        data: {
            pos: data.pos,
            ideaId: data.node.id,
            shaded: data.node.shaded
        }
    }),

    ['context-menu-item-selected']: data => {
        const {menuItem} = data;
        const action = menuItem.onSelectAction();
        dispatch(action);
    },

    ['node-title-change']: data => dispatch({
        type: 'set-idea-value',
        data: {
            ideaId: data.nodeId,
            value: data.title
        }
    }),

    ['link-title-change']: data => dispatch({
        type: 'set-association-value',
        data: {
            assocId: data.linkId,
            value: data.title
        }
    }),

    ['node-position-change']: data => dispatch({
        type: 'set-idea-position',
        data: {
            ideaId: data.nodeId,
            pos: data.pos
        }
    }),

    ['viewbox-position-change']: data => dispatch({
        type: 'set-mindmap-position',
        data: {
            mindmapId: data.graphId,
            pos: data.pos
        }
    }),

    ['viewbox-scale-change']: data => dispatch({
        type: 'set-mindmap-scale',
        data: {
            mindmapId: data.graphId,
            scale: data.scale,
            pos: data.pos
        }
    }),

    ['picker-color-change']: data => {
        const {picker, color} = data;
        const action = picker.onSelectAction({color});
        dispatch(action);
    },

    ['node-menu-idea-add']: data => dispatch({
        type: 'create-idea',
        data: {
            parentIdeaId: data.parentIdeaId
        }
    }),

    ['node-menu-idea-remove']: data => dispatch({
        type: 'remove-idea',
        data: {
            ideaId: data.ideaId
        }
    }),

    ['association-tails-lookup-phrase-changed']: data => {
        const {lookup, phrase} = data;
        const action = lookup.onPhraseChangeAction({phrase});
        dispatch(action);
    },
    
    ['association-tails-lookup-suggestion-selected']: data => {
        const {lookup, suggestion} = data;
        const action = lookup.onSelectAction({suggestion});
        dispatch(action);
    },

    ['wheel']: data => dispatch({
        type: 'on-graph-wheel',
        data: {
            pos: data.pos,
            up: data.up
        }
    }),

    ['viewport-resize']: data => dispatch({
        type: 'on-graph-viewport-resize',
        data: {
            size: data.size
        },
        throttleLog: true
    }),

    ['click']: () => dispatch({
        type: 'on-graph-click'
    })

}))(VM);