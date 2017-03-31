import {connect} from 'ui/views/shared/vm-connect';
import Component from './Node.jsx';

export default connect(props => props.node)(Component);