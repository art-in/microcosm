import Point from 'client/viewmodels/misc/Point';

export default React.createClassWithCSS({

  propTypes: {
    pos1: React.PropTypes.instanceOf(Point).isRequired,
    pos2: React.PropTypes.instanceOf(Point).isRequired
  },

  render() {
    let {id, pos1, pos2, ...other} = this.props;

    return (
      <line id={id}
            x1={ this.props.pos1.x } y1={ this.props.pos1.y }
            x2={ this.props.pos2.x } y2={ this.props.pos2.y }
            {...other} />
    );
  }

})