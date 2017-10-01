import {connect} from 'vm/utils/store-connect';

import VM from './Graph';

export default connect(dispatch => ({

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

    ['picker-color-change']: data => dispatch(
        'set-idea-color', {
            ideaId: data.ideaId,
            color: data.color
        }),

    ['node-menu-idea-add']: data => dispatch(
        'create-idea', {
            parentIdeaId: data.parentIdeaId
        }),

    ['node-menu-idea-remove']: data => dispatch(
        'remove-idea', {
            ideaId: data.ideaId
        }),

    ['association-tails-lookup-phrase-changed']: data => dispatch(
        'search-association-tails-for-lookup', {
            headIdeaId: data.node.id,
            phrase: data.phrase
        }),
    
    ['association-tails-lookup-suggestion-selected']: data => dispatch(
        'create-cross-association', {
            headIdeaId: data.node.id,
            tailIdeaId: data.suggestion.data
        })

}))(VM);