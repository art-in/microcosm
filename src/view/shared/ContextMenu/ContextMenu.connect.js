import {connect} from 'view/utils/vm-connect';
import Component from './ContextMenu.jsx';

export default connect(props => props.menu)(Component);