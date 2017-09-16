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
    )
    
}))(VM);