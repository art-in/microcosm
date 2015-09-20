import MenuVM from 'client/viewmodels/misc/Menu';
import MenuItem from './MenuItem';
import Point from 'client/viewmodels/misc/Point';
import ViewModelComponent from 'client/views/shared/ViewModelComponent';

export default React.createClassWithCSS({

  displayName: 'Menu',

  propTypes: {
    menu: React.PropTypes.instanceOf(MenuVM).isRequired
  },

  css: {
    menu: {
      'border': '1px solid gray',
      'max-width': '200px',
      'background-color': 'white'
    }
  },

  render() {

    let {menu, className, ...other} = this.props;

    let items = menu.items.map((item) => {
      return (<MenuItem key={ item.id }
                        item={ item }
                        onClick={ menu.onItemSelected.bind(menu, item) } />);
    });

    return (
      <div id={ this.constructor.displayName }
           className={ cx(this.css().menu, className) }
           onClick={ this.onClick }
           {...other} >

        { items }

      </div>
    );
  }

})