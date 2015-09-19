import Point from 'client/viewmodels/misc/Point';

export default React.createClassWithCSS({

  propTypes: {
    align: React.PropTypes.string,
    pos: React.PropTypes.instanceOf(Point)
  },

  render() {

    let {align, pos, ...other} = this.props;

    return (
      <text textAnchor={ align }
            x={ pos && pos.x } y={ pos && pos.y }
            {...other}>

        {this.props.children}

      </text>
    );
  }

})