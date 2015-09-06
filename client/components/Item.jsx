Item = React.createClassWithCSS({

  propTypes: {
    name: React.PropTypes.string.isRequired
  },

  css: {
    component: {
      'font-size': '24px',
      'font-weight': 'bold'
    },
    '@media print': {
      component: {
        'border': '5px dashed black'
      }
    }
  },

  render() {
    return (
      <div className={ cx(this.css().component) }>
        { this.props.name }
      </div>
    );
  }

});