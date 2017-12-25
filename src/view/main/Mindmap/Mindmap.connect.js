import connect from 'view/utils/connect';
import Component from './Mindmap.jsx';

export default connect(
    props => props.mindmap,
    dispatch => ({

        onKeyDown: data => dispatch({
            type: 'on-mindmap-keydown',
            data,
            throttleLog: true
        }),

        onGoRootButtonClick: () => dispatch({
            type: 'on-go-root-button-click'
        })

    })
)(Component);