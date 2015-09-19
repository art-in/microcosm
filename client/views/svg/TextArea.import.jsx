import Point from 'client/viewmodels/misc/Point';
import EditableField from '../misc/EditableField';
import Text from './Text';

export default React.createClassWithCSS({

  displayName: 'TextArea',

  propTypes: {
    value: React.PropTypes.string.isRequired,
    pos: React.PropTypes.instanceOf(Point),
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number,
    editable: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      editable: false
    };
  },

  render() {

    let {
      value, pos, width, height,
      onChange,
      editable,
      ...other} = this.props;

    return (
      <foreignObject x={ pos && pos.x } y={ pos && pos.y }>

        {
          editable ?
            <EditableField style={{width, height}}
                           html={ value }
                           tag='div'
                           focusOnMount={ true }
                           onChange={ onChange }
                           {...other} />

          : <div style={{width, height}} {...other}>
              {value}
            </div>
        }
      </foreignObject>
    );
  }

});

