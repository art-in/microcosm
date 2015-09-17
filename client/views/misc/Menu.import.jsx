import Menu from 'client/viewmodels/misc/Menu';
import MenuItem from './MenuItem';
import Point from 'client/viewmodels/Point';

export default React.createClassWithCSS({

  propTypes: {
    menu: React.PropTypes.instanceOf(Menu).isRequired,
    pos: React.PropTypes.instanceOf(Point),
    onItemClick: React.PropTypes.func.isRequired
  },

  onItemClick(item) {
    this.props.onItemClick.call(null, item);
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

    let items = this.props.menu.items.map((item) => {
      return (<MenuItem key={ item.id }
                        item={ item }
                        onClick={ this.onItemClick.bind(null, item) } />);
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