import Point from 'client/viewmodels/misc/Point';

export default React.createClassWithCSS({

  propTypes: {
    pos: React.PropTypes.instanceOf(Point)
  },

  render() {

    let {pos, ...other} = this.props;

    return (
      <g transform={`translate(${pos.x} ${pos.y})`}
            {...other}>

        {this.props.children}

      </g>
    );
  }

})