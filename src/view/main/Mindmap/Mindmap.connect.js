import connect from 'view/utils/connect';
import Component from './Mindmap.jsx';

export default connect(
    props => props.mindmap,
    dispatch => ({

        onGoRootButtonClick: () => dispatch({
            type: 'on-go-root-button-click'
        })

    })
)(Component);