import {connect} from 'client/views/shared/vm-component';
import Component from './Mindmap.jsx';

export default connect(props => props.mindmap)(Component);