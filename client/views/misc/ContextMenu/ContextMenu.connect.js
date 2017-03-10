import {connect} from 'client/views/shared/vm-component';
import Component from './ContextMenu.jsx';

export default connect(props => props.menu)(Component);