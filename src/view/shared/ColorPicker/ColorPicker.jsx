import React, {Component} from 'react';

import ColorPickerVmType from 'vm/shared/ColorPicker';

import classes from './ColorPicker.css';

const DEFAULT_COLOR = '#000000';

// TODO: eslint 'valid-jsdoc' fails if class has arrow-function fields
// eslint-disable-next-line valid-jsdoc
/**
 * Color picker without toggle button.
 * Needs custom toggler. Activated through view model.
 *
 * If you need color picker with default toggle button - just use
 * <input type="color"> directly or introduce 'hideToggleButton' prop here.
 *
 * @typedef {object} Props
 * @prop {ColorPickerVmType} picker
 * @prop {function({color})} onChange
 *
 * @extends {Component<Props>}
 */
export default class ColorPicker extends Component {
  /**
   * Indicates that picker is been activating programmatically
   * (ie. through view model and not through direct user click)
   * @type {boolean}
   */
  isProgActivation = false;

  componentDidUpdate() {
    this.forcePicker();
  }

  componentDidMount() {
    this.forcePicker();

    // need to manually subscribe to 'change' event since react 'onChange'
    // handler really sets handler for 'input' event, which happens too
    // frequently
    this.input.addEventListener('change', this.onChange);
  }

  componentWillUnmount() {
    this.input.removeEventListener('change', this.onChange);
  }

  forcePicker() {
    const {picker} = this.props;

    if (picker.active) {
      // Q: why set initial value manually and not in render?
      // A: setting value in render means making input 'controllable',
      //    which requires declaratively bind value to local state or
      //    props and then pass onChange handler. since we only need
      //    to pass initial value, manual way is much simpler.
      // default color makes sure browser wont warn if initial value is
      // empty (Chrome warns on empty string, null and undefined)
      this.input.value = picker.initialColor || DEFAULT_COLOR;

      // need to focus input before click (Edge)
      this.isProgActivation = true;
      this.input.focus();
      this.input.click();
    }
  }

  onClick = e => {
    if (!this.isProgActivation) {
      // prevent activating by user click (ie. tap on top-left corner, where
      // pseudo-hidden toggle button is located)
      e.preventDefault();
    }

    this.isProgActivation = false;
  };

  onChange = nativeEvent => {
    const color = nativeEvent.currentTarget.value;
    this.props.onChange({color});
  };

  render() {
    // Always render target input because Chrome needs sometime to mount it
    // before we can force picker to show up (ie. input.click()),
    // while forcing already mounted input works instantly.
    // NOTE: picker cannot be forced on page load with any delay at all.

    return (
      <input
        type="color"
        className={classes.input}
        ref={node => (this.input = node)}
        onClick={this.onClick}
      />
    );
  }
}
