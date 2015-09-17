import MenuItem from 'client/viewmodels/misc/MenuItem';

export default React.createClassWithCSS({

  propTypes: {
    item: React.PropTypes.instanceOf(MenuItem).isRequired
  },

  css: {
    item: {
      'padding': '5px',
      '&:hover': {
        'background-color': 'lightgray'
      }
    }
  },

  render() {

    let {className, ...other} = this.props;

    return (
      <div className={ cx(this.css().item, className) }
           {...other}>

        { this.props.item.displayValue }

      </div>
    );
  }

})