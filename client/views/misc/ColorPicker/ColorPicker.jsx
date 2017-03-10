import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import ColorPickerVM from 'client/viewmodels/misc/ColorPicker';

import classes from './ColorPicker.css';

export default class ColorPicker extends Component {
    
    static propTypes = {
        picker: PropTypes.instanceOf(ColorPickerVM).isRequired
    }

    componentDidUpdate() {
        this.forcePicker();
    }

    componentDidMount() {
        this.forcePicker();
    }

    forcePicker() {
        if (this.props.picker.active) {
            ReactDom.findDOMNode(this.refs.input).click();
        }
    }

    onChange = e => {
        this.props.picker.onColorSelected(e.currentTarget.value);
    }
    
    render() {

        // Always render target input because Chrome needs sometime to mount it
        // before we can force picker to show up (ie. input.click()),
        // while forcing already mounted input works instantly.
        // NOTE: picker cannot be forced on page load with any delay at all.

        return (
            <input ref='input'
                type='color'
                onChange={ this.onChange }
                className={ classes.input } />
        );
    }

}