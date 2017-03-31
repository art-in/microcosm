import {connect} from 'ui/views/shared/vm-connect';
import Component from './Mindmap.jsx';

export default connect(props => props.mindmap)(Component);