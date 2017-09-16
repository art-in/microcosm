import {connect} from 'view/utils/vm-connect';
import Component from './Link.jsx';

export default connect(props => props.link)(Component);