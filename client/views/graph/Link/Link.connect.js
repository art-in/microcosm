import {connect} from 'client/views/shared/vm-component';
import Component from './Link.jsx';

export default connect(props => props.link)(Component);