import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ColorPickerVM from 'ui/viewmodels/misc/ColorPicker';

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
            this.input.click();
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
            <input ref={node => this.input = node}
                type='color'
                onChange={ this.onChange }
                className={ classes.input } />
        );
    }

}