import connect from 'view/utils/connect';
import Component from './Mindset.jsx';

export default connect(
    props => props.mindset,
    dispatch => ({

        onKeyDown: data => dispatch({
            type: 'on-mindset-keydown',
            data,
            throttleLog: true
        }),

        onGoRootButtonClick: () => dispatch({
            type: 'on-go-root-button-click'
        })

    })
)(Component);