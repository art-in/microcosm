import connect from 'view/utils/connect';
import Component from './Mindlist.jsx';

export default connect(props => props.list)(Component);
