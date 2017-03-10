import {connect} from 'client/views/shared/vm-component';
import Component from './Main.jsx';

export default connect(props => props.vm)(Component);