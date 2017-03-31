import {connect} from 'ui/views/shared/vm-connect';
import Component from './ColorPicker.jsx';

export default connect(props => props.picker)(Component);