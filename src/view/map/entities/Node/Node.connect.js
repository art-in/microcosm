import connect from 'view/utils/connect';
import Component from './Node.jsx';

export default connect(
    props => props.node,
    (dispatch, props) => ({

        onTitleDoubleClick: () => dispatch({
            type: 'on-node-title-double-click',
            data: {
                nodeId: props.node.id
            },
            throttleLog: true
        }),

        onTitleBlur: () => dispatch({
            type: 'on-node-title-blur',
            data: {
                nodeId: props.node.id
            },
            throttleLog: true
        }),

        onTitleChange: title => dispatch({
            type: 'on-node-title-change',
            data: {
                nodeId: props.node.id,
                title
            },
            throttleLog: true
        })

    }))(Component);