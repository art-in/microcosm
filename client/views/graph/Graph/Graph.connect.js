import {connect} from 'client/views/shared/vm-component';
import Component from './Graph.jsx';

export default connect(props => props.graph)(Component);