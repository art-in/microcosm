import {connect} from 'vm/utils/store-connect';

import VM from './Graph';

export default connect(dispatch => ({

    ['link-rightclick']: data => dispatch(
        'show-context-menu-for-association', {
            pos: data.pos,
            associationId: data.link.id,
            shaded: data.link.shaded
        }
    ),

    ['node-rightclick']: data => dispatch(
        'show-context-menu-for-idea', {
            pos: data.pos,
            ideaId: data.node.id,
            shaded: data.node.shaded
        }
    ),

    ['context-menu-item-selected']: data => {
        const {menuItem} = data;
        const action = menuItem.onSelectAction();
        dispatch(action.type, action.data);
    },

    ['node-title-change']: data => dispatch(
        'set-idea-value', {
            ideaId: data.nodeId,
            value: data.title
        }),

    ['link-title-change']: data => dispatch(
        'set-association-value', {
            assocId: data.linkId,
            value: data.title
        }),

    ['node-position-change']: data => dispatch(
        'set-idea-position', {
            ideaId: data.nodeId,
            pos: data.pos
        }
    ),

    ['viewbox-position-change']: data => dispatch(
        'set-mindmap-position', {
            mindmapId: data.graphId,
            pos: data.pos
        }
    ),

    ['viewbox-scale-change']: data => dispatch(
        'set-mindmap-scale', {
            mindmapId: data.graphId,
            scale: data.scale,
            pos: data.pos
        }
    ),

    ['picker-color-change']: data => {
        const {picker, color} = data;
        const action = picker.onSelectAction({color});
        dispatch(action.type, action.data);
    },

    ['node-menu-idea-add']: data => dispatch(
        'create-idea', {
            parentIdeaId: data.parentIdeaId
        }),

    ['node-menu-idea-remove']: data => dispatch(
        'remove-idea', {
            ideaId: data.ideaId
        }),

    ['association-tails-lookup-phrase-changed']: data => {
        const {lookup, phrase} = data;
        const action = lookup.onPhraseChangeAction({phrase});
        dispatch(action.type, action.data);
    },
    
    ['association-tails-lookup-suggestion-selected']: data => {
        const {lookup, suggestion} = data;
        const action = lookup.onSelectAction({suggestion});
        dispatch(action.type, action.data);
    }

}))(VM);