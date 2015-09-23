import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import ColorPickerVM from 'client/viewmodels/misc/ColorPicker';

export default React.createClassWithCSS({

  displayName: 'ColorPicker',

  mixins: [ViewModelComponent],

  propTypes: {
    picker: React.PropTypes.instanceOf(ColorPickerVM).isRequired
  },

  getViewModel() {
    return {picker: this.props.picker};
  },

  componentDidUpdate() {
    this.forcePicker();
  },

  componentDidMount() {
    this.forcePicker();
  },

  forcePicker() {
    if (this.props.picker.active) {
      React.findDOMNode(this.refs.input).click();
    }
  },

  onChange(e) {
    this.props.picker.onColorSelected(e.currentTarget.value);
  },

  css: {
    input: {
      'position': 'absolute',
      'visibility': 'hidden',
      'left': '0', 'top': '0',
      'width': '0', 'height': '0'
    }
  },

  render() {

    // Always render target input because Chrome needs sometime to mount it
    // before we can force picker to show up (ie. input.click()),
    // while forcing already mounted input works instantly.
    // NOTE: picker cannot be forced on page load with any delay at all.

    return (
      <input id={ this.constructor.displayName }
             ref='input'
             type='color'
             onChange={ this.onChange }
             className={ this.css().input } />
    );
  }

});