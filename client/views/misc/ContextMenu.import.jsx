import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import ContextMenuVM from 'client/viewmodels/misc/ContextMenu';
import MenuItem from './MenuItem';
import Point from 'client/viewmodels/misc/Point';
import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import Menu from './Menu';

export default React.createClassWithCSS({

  displayName: 'ContextMenu',

  mixins: [DisplayNameAttribute, ViewModelComponent],

  propTypes: {
    menu: React.PropTypes.instanceOf(ContextMenuVM).isRequired
  },

  getViewModel() {
    return {menu: this.props.menu};
  },

  css: {
    menu: {
      'position': 'absolute'
    }
  },

  render() {

    let {menu, className, ...other} = this.props;

    if (!menu.active) {
      // We can return null, and React will replace it with <noscript> itself,
      // but in this case it will continiously update DOM this <noscript>.
      // This will not be required when React omit any DOM change on null.
      // https://facebook.github.io/react/blog/2014/07/17/react-v0.11.html#rendering-to-null
      return (<noscript/>);
    }

    return (
      <Menu menu={ menu }
            className={ cx(this.css().menu, className) }
            style={{
              left: `${menu.pos.x}px`,
              top: `${menu.pos.y}px`
            }}
            {...other} />
    );
  }

})