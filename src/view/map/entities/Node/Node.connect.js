import connect from 'view/utils/connect';
import Component from './Node.jsx';

export default connect(
    props => props.node,
    (dispatch, props) => ({

        onClick: () => dispatch({
            type: 'on-node-click',
            data: {
                nodeId: props.node.id
            }
        })

    }))(Component);