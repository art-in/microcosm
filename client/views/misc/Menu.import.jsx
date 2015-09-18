import MenuVM from 'client/viewmodels/misc/Menu';
import MenuItem from './MenuItem';
import Point from 'client/viewmodels/Point';
import ViewModelComponent from 'client/views/shared/ViewModelComponent';

export default React.createClassWithCSS({

  displayName: 'Menu',

  propTypes: {
    menu: React.PropTypes.instanceOf(MenuVM).isRequired,
    pos: React.PropTypes.instanceOf(Point)
  },

  css: {
    menu: {
      'border': '1px solid gray',
      'max-width': '200px',
      'background-color': 'white'
    }
  },

  render() {

    let {className, menu, pos, ...other} = this.props;

    let items = menu.items.map((item) => {
      return (<MenuItem key={ item.id }
                        item={ item }
                        onClick={ menu.onItemSelected.bind(menu, item) } />);
    });

    let styles = {};
    if (pos) {
      styles = {position: 'absolute', left: `${pos.x}px`, top: `${pos.y}px`};
    }

    return (
      <div className={ cx(this.css().menu, className) }
           style={ styles }
           onClick={ this.onClick }
           {...other} >

        { items }

      </div>
    );
  }

})