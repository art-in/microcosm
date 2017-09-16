import {connect} from 'view/utils/vm-connect';
import Component from './Mindmap.jsx';

export default connect(props => props.mindmap)(Component);