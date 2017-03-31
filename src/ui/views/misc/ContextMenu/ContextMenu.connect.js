import {connect} from 'ui/views/shared/vm-connect';
import Component from './ContextMenu.jsx';

export default connect(props => props.menu)(Component);