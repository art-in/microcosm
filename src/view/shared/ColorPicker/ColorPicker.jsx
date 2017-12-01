import React, {Component} from 'react';

import ColorPickerVmType from 'vm/shared/ColorPicker';

// @ts-ignore
import classes from './ColorPicker.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {ColorPickerVmType} picker
 * @prop {function({color})} onChange
 * 
 * @extends {Component<Props>}
 */
export default class ColorPicker extends Component {
    
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
        const color = e.currentTarget.value;
        this.props.onChange({color});
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