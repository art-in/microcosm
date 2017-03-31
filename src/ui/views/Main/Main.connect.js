import {connect} from 'ui/views/shared/vm-connect';
import Component from './Main.jsx';

export default connect(props => props.vm)(Component);