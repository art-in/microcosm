import {connect} from 'view/utils/vm-connect';
import Component from './Lookup.jsx';

export default connect(props => props.lookup)(Component);