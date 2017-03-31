import {connect} from '../shared/store-connect';

import VM from './Mindmap';

export default connect(dispatch => ({

    ['idea-color-change']: data => dispatch(
        'set-idea-color', {
            ideaId: data.ideaId,
            color: data.color
        }),

    ['idea-add']: data => dispatch(
        'create-idea', {
            parentIdeaId: data.parentIdeaId
        }),

    ['idea-remove']: data => dispatch(
        'remove-idea', {
            ideaId: data.ideaId
        })

}))(VM);