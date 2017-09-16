import {connect} from 'view/utils/vm-connect';
import Component from './Node.jsx';

export default connect(props => props.node)(Component);