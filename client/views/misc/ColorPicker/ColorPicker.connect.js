import {connect} from 'client/views/shared/vm-component';
import Component from './ColorPicker.jsx';

export default connect(props => props.picker)(Component);