import {connect} from 'view/utils/vm-connect';
import Component from './Graph.jsx';

export default connect(props => props.graph)(Component);