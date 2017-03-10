import {connect} from 'client/views/shared/vm-component';
import Component from './Node.jsx';

export default connect(props => props.node)(Component);