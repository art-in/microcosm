import {connect} from 'view/utils/vm-connect';
import Component from './ColorPicker.jsx';

export default connect(props => props.picker)(Component);