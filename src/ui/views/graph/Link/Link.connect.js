import {connect} from 'ui/views/shared/vm-connect';
import Component from './Link.jsx';

export default connect(props => props.link)(Component);