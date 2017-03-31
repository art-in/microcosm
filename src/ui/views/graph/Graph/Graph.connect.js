import {connect} from 'ui/views/shared/vm-connect';
import Component from './Graph.jsx';

export default connect(props => props.graph)(Component);